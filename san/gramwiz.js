function gramwiz_suggest(num) {
	let form = "text_gw_" + num;
	let text = document.getElementById(form).value;
	text = text.trim();

	//filter bad words
	const badSearch = ["=", " ", ".", ",", ";", ":", "/"];
	if (badSearch.includes(text)) { return -1; }

	const regexHan = /[가-힣]/;
	if (regexHan.test(text)) { return -1; }

	//get likelinesses
	let IDR = analyse_likeliness(text);

	//display suggestions
	let source = ""; let SugText = []; let SugIndex = [];

	for (let i = 1; i < IDR.length; i ++) {
		SugText.push(grid(dict, column.title, IDR[i]) + "<sup>" + grid(dict, column.tag_homonym, IDR[i]) + "</sup>");
		SugIndex.push(IDR[i]);
	}

	source += "<small>다음 목록에서 <strong>" + num +"번 단어</strong>를 선택하세요!&nbsp;&nbsp;</small>";
	for (let i = 0; i < SugText.length; i ++) {
		source += "<a onclick=\"accept_suggestion(" + SugIndex[i] + "," + num + ")\">" + SugText[i] + "</a>";
		if (i < SugText.length - 1) { source += " · " }
	}

	document.getElementById("gramwiz_input_suggest").innerHTML = source;
	document.getElementById("text_gw_" + num).value = "";

	//if good and unique then immd. accept
	for (let i = 0; i < dict.length; i ++) {
		if (grid(dict, column.title, i).toLowerCase() == text.toLowerCase() && grid(dict, column.tag_homonym, i) == "") {
			accept_suggestion(i, num);
			break;
		}
	}
}

function accept_suggestion(index, num) {
	//if no index then skip
	if (index != -1) {
		document.getElementById("gw_" + num).innerHTML = grid(dict, column.title, index);
		gramwizIndex[num - 1] = index;
	}

	let source_1 = ""; let source_2 = "";

	if (gramwizIndex[0] != -1) {
		source_1 = `<p><strong>${grid(dict, column.title, gramwizIndex[0])}</strong> <span class="IPA">[${showPronounce(grid(dict, column.title, gramwizIndex[0]), true)}]</span> : <small>${grid(dict, column.gloss_ko, gramwizIndex[0]).replaceAll("<br>", "; ")}</small></p>`;
	}

	if (gramwizIndex[1] != -1) {
		source_2 = `<p><strong>${grid(dict, column.title, gramwizIndex[1])}</strong> <span class="IPA">[${showPronounce(grid(dict, column.title, gramwizIndex[1]), true)}]</span> : <small>${grid(dict, column.gloss_ko, gramwizIndex[1]).replaceAll("<br>", "; ")}</small></p>`;
	}

	document.getElementById("synth_gloss").innerHTML = `<p style="margin-top: -60px;"></p>${source_1}${source_2}`;
	gramwiz_result();
}

function gramwiz_result() {
	let source_result = "";

	if (gramwizIndex[0] == -1 || gramwizIndex[1] == -1) {
		return -1;
	}

	//sandhi
	//case 1: b is noun
	if (["m", "f", "n"].includes(grid(dict, column.class, gramwizIndex[1]))) {
		let source_sandhi = "";
		let b_gender = grid(dict, column.class, gramwizIndex[1]);
		b_gender = ["0", "m", "f", "n"].indexOf(b_gender); // convert to number

		let a_comp = grid(dict, column.grammar, gramwizIndex[0]);
		let b_sole = grid(dict, column.grammar + b_gender, gramwizIndex[1]);

		let sandhi_iast = gramwiz_sandhi(a_comp, b_sole);
		let sandhi_pron = showPronounce(sandhi_iast, true);

		//sole
		source_sandhi += `<div style="display: block; text-align: center; line-height: 100%; font-size: 42px;"><p><strong><em>${sandhi_iast}</em></strong>&nbsp;<wbr><small class="IPA">[${sandhi_pron}]</small></p><p class="sanskrit" style="font-size: 30px;">${LattoDev(sandhi_iast)}</p></div>`;

		//details
		let N = [b_gender, b_gender + 3, b_gender + 6];
		let B = []; let S = []; let V = [];

		for (e of N) {
			B.push(grid(dict, column.grammar + e, gramwizIndex[1]));
		}
		for (e of B) {
			S.push(gramwiz_sandhi(a_comp, e));
		}
		for (e of S) {
			V.push(showPronounce(e, true));
		}

		source_sandhi += `<br><details>
				<summary>상세 정보 보기</summary>
				<br><table style="margin-left: 30px;">
					<tr>
						<th>단수<small>(하나)</small></th>
						<th>쌍수<small>(둘)</small></th>
						<th>복수<small>(셋 이상)</small></th>
					</tr>
					<tr>
						<td><p><strong>${S[0]}</strong></p><p class="sanskrit">${LattoDev(S[0])}</p><p class="IPA"><small>${V[0]}</small></p></td>
						<td><p><strong>${S[1]}</strong></p><p class="sanskrit">${LattoDev(S[1])}</p><p class="IPA"><small>${V[1]}</small></p></td>
						<td><p><strong>${S[2]}</strong></p><p class="sanskrit">${LattoDev(S[2])}</p><p class="IPA"><small>${V[2]}</small></p></td>
					</tr>
				</table>
			</details><br><hr><br>`;


		source_sandhi = source_sandhi.replaceAll("[]", "&nbsp;");
		if (!properties.showDevanagari) {
			source_sandhi = source_sandhi.replaceAll(/<span class="sanskrit">.*?<\/span>/g, "");
			source_sandhi = source_sandhi.replaceAll(/<p class="sanskrit">.*?<\/p>/g, "");
		}

		document.getElementById("synth_result").innerHTML = source_sandhi;
	}
	//case 2: b is adj
	else if (grid(dict, column.class, gramwizIndex[1]) == "a") {
		let source_sandhi = "";
		let a_comp = grid(dict, column.grammar, gramwizIndex[0]);

		let sm = gramwiz_sandhi(a_comp, grid(dict, column.grammar + 1, gramwizIndex[1]));
		let sf = gramwiz_sandhi(a_comp, grid(dict, column.grammar + 2, gramwizIndex[1]));
		let sn = gramwiz_sandhi(a_comp, grid(dict, column.grammar + 3, gramwizIndex[1]));

		//sole
		source_sandhi += `<div style="display: block; text-align: center; line-height: 100%; font-size: 42px;">
				<p><small>(남성형)</small>&nbsp;<strong><em>${sm}</em></strong>&nbsp;<wbr><small class="IPA">[${showPronounce(sm, true)}]</small></p><p class="sanskrit" style="font-size: 30px;">${LattoDev(sm)}</p>
				<p><small>(여성형)</small>&nbsp;<strong><em>${sf}</em></strong>&nbsp;<wbr><small class="IPA">[${showPronounce(sf, true)}]</small></p><p class="sanskrit" style="font-size: 30px;">${LattoDev(sf)}</p>
				<p><small>(중성형)</small>&nbsp;<strong><em>${sn}</em></strong>&nbsp;<wbr><small class="IPA">[${showPronounce(sn, true)}]</small></p><p class="sanskrit" style="font-size: 30px;">${LattoDev(sn)}</p>
			</div>`;

		//details
		let N = []; for (let i = 0; i < column.grammar_length; i ++) { N.push(column.grammar + i); }
		let B = []; let S = []; let V = [];

		for (e of N) {
			B.push(grid(dict, e, gramwizIndex[1]));
		}
		for (e of B) {
			S.push(gramwiz_sandhi(a_comp, e));
		}
		for (e of S) {
			V.push(showPronounce(e, true));
		}

		source_sandhi += `<br><details>
				<summary>상세 정보 보기</summary>
				<br><table style="margin-left: 30px;">
					<p><strong>남성형</strong></p>
					<tr>
						<th>단수<small>(하나)</small></th>
						<th>쌍수<small>(둘)</small></th>
						<th>복수<small>(셋 이상)</small></th>
					</tr>
					<tr>
						<td><p><strong>${S[0]}</strong></p><p class="sanskrit">${LattoDev(S[0])}</p><p class="IPA"><small>${V[0]}</small></p></td>
						<td><p><strong>${S[3]}</strong></p><p class="sanskrit">${LattoDev(S[3])}</p><p class="IPA"><small>${V[3]}</small></p></td>
						<td><p><strong>${S[6]}</strong></p><p class="sanskrit">${LattoDev(S[6])}</p><p class="IPA"><small>${V[6]}</small></p></td>
					</tr>
				</table>
				<br><table style="margin-left: 30px;">
					<p><strong>여성형</strong></p>
					<tr>
						<th>단수<small>(하나)</small></th>
						<th>쌍수<small>(둘)</small></th>
						<th>복수<small>(셋 이상)</small></th>
					</tr>
					<tr>
						<td><p><strong>${S[1]}</strong></p><p class="sanskrit">${LattoDev(S[1])}</p><p class="IPA"><small>${V[1]}</small></p></td>
						<td><p><strong>${S[4]}</strong></p><p class="sanskrit">${LattoDev(S[4])}</p><p class="IPA"><small>${V[4]}</small></p></td>
						<td><p><strong>${S[7]}</strong></p><p class="sanskrit">${LattoDev(S[7])}</p><p class="IPA"><small>${V[7]}</small></p></td>
					</tr>
				</table>
				<br><table style="margin-left: 30px;">
					<p><strong>중성형</strong></p>
					<tr>
						<th>단수<small>(하나)</small></th>
						<th>쌍수<small>(둘)</small></th>
						<th>복수<small>(셋 이상)</small></th>
					</tr>
					<tr>
						<td><p><strong>${S[2]}</strong></p><p class="sanskrit">${LattoDev(S[2])}</p><p class="IPA"><small>${V[2]}</small></p></td>
						<td><p><strong>${S[5]}</strong></p><p class="sanskrit">${LattoDev(S[5])}</p><p class="IPA"><small>${V[5]}</small></p></td>
						<td><p><strong>${S[8]}</strong></p><p class="sanskrit">${LattoDev(S[8])}</p><p class="IPA"><small>${V[8]}</small></p></td>
					</tr>
				</table>
			</details><br><hr><br>`;

		source_sandhi = source_sandhi.replaceAll("[]", "&nbsp;");
		if (!properties.showDevanagari) {
			source_sandhi = source_sandhi.replaceAll(/<span class="sanskrit">.*?<\/span>/g, "");
			source_sandhi = source_sandhi.replaceAll(/<p class="sanskrit">.*?<\/p>/g, "");
		}

		document.getElementById("synth_result").innerHTML = source_sandhi;
	}

	//gloss guide
	let gloss_1 = grid(dict, column.gloss_ko, gramwizIndex[0]).replaceAll("<br>", "; ").replace(/<.*?>/g, "");
	let gloss_2 = grid(dict, column.gloss_ko, gramwizIndex[1]).replaceAll("<br>", "; ").replace(/<.*?>/g, "");
	let gloss_maxLength = 7;
	if (gloss_1.length > gloss_maxLength) { gloss_1 = gloss_1.slice(0, gloss_maxLength - 1).trim() + "…"; }
	if (gloss_2.length > gloss_maxLength) { gloss_2 = gloss_2.slice(0, gloss_maxLength - 1).trim() + "…"; }
	gloss_1 = "<strong>[" + gloss_1 + "]</strong>"; gloss_2 = "<strong>[" + gloss_2 + "]</strong>";

	//noun + noun
	if (["m", "f", "n", "a"].includes(grid(dict, column.class, gramwizIndex[0])) && ["m", "f", "n"].includes(grid(dict, column.class, gramwizIndex[1]))) {
		let a_gloss = grid(dict, column.title, gramwizIndex[0]);
		let b_gloss = grid(dict, column.title, gramwizIndex[1]);
		
		if (grid(dict, column.class, gramwizIndex[0]) != "a") {
			source_result += `<p>이 단어는 <span style="color:${color.anchor}"><strong>“${a_gloss}와 ${b_gloss}”, “${a_gloss}의 ${b_gloss}”</strong></span> 등의 의미를 가질 수 있습니다.</p>`;
		}
		else {
			source_result += `<p>이 단어는 <span style="color:${color.anchor}"><strong>“${a_gloss}한 ${b_gloss}”, “${a_gloss}(한 물건/현상/사람)의 ${b_gloss}”, “${a_gloss}(한 물건/현상/사람)과 ${b_gloss}”</strong></span> 등의 의미를 가질 수 있습니다.</p>`;
		}
	}
	//noun + adj
	else if (["m", "f", "n", "a"].includes(grid(dict, column.class, gramwizIndex[0])) && ["a"].includes(grid(dict, column.class, gramwizIndex[1]))) {
		let a_gloss = grid(dict, column.title, gramwizIndex[0]);
		let b_gloss = grid(dict, column.title, gramwizIndex[1]);

		if (grid(dict, column.class, gramwizIndex[0]) != "a") {
			source_result += `<p>이 단어는 <span style="color:${color.anchor}"><strong>“${a_gloss}와 ${b_gloss}(한 물건/현상/사람)”, “${a_gloss}의 ${b_gloss}(한 물건/현상/사람)”</strong></span> 등의 의미를 가질 수 있습니다.</p>`;
		}
		else {
			source_result += `<p>이 단어는 <span style="color:${color.anchor}"><strong>“${a_gloss}하고 ${b_gloss}(한 물건/현상/사람)”, “${a_gloss}(한 물건/현상/사람)의 ${b_gloss}(한 물건/현상/사람)”, “${a_gloss}(한 물건/현상/사람)과 ${b_gloss}(한 물건/현상/사람)”</strong></span> 등의 의미를 가질 수 있습니다.</p>`;
		}
	}

	source_result = source_result.replaceAll("[]", "");
	if (!properties.showDevanagari) {
		source_result = source_result.replaceAll(/<span class="sanskrit">.*?<\/span>/g, "");
		source_result = source_result.replaceAll(/<p class="sanskrit">.*?<\/p>/g, "");
	}
	document.getElementById("gramwiz_result").innerHTML = source_result;
}

function analyse_likeliness(text) {
	let List = [];

	for (let i = 0; i < dict.length; i ++) {
		let word1 = remove_diacritics(grid(dict, column.title, i).toLowerCase());
		let word2 = remove_diacritics(text.toLowerCase());

		let word_long = ""; let word_short = "";
		if (word1.length >= word2.length) { word_long = word1; word_short = word2; }
		else { word_long = word2; word_short = word1; }
		let len = word_long.length

		//일일이 비교
		let l1 = 0;

		for (let j = 0; j < len; j ++) {
			let chr1 = word_long.charAt(j);
			let chr2 = word_short.charAt(j);

			if (chr1 == "" || chr2 == "") { continue; }
			if (chr1 == chr2) { l1 ++; }
			if ((chr1 == "'" && chr2 == "’") || (chr2 == "'" && chr1 == "’")) { l1 ++; }

			if ((chr1 == "a" && chr2 == "ä") || (chr2 == "ä" && chr1 == "a") || (chr1 == "o" && chr2 == "ö") || (chr2 == "ö" && chr1 == "o")) { l1 += 0.5; }
		}

		l1 /= len;

		//포함 관계
		let l2 = 0;

		if (word_long.includes(word_short)) {
			l2 = word_short.length / word_long.length;
		}

		let likeliness = Math.max(l1, l2);

		List.push(likeliness);
	}

	//유사도 상위 n개 추출
	let Index = [-1]; let IndexMax = 1; let howmany = 15;

	while (Index.length <= howmany) {
		let ind = 0; let max = 0;

		for (let i = 0; i < List.length; i ++) {
			if (List[i] > max && List[i] <= IndexMax && !Index.includes(i)) {
				ind = i; max = List[i];
			}
		}

		if (max == 0) { break; }

		Index.push(ind);
		IndexMax = max;
	}

	let IndexRemoveDuplicate = Array.from(new Set(Index));

	return IndexRemoveDuplicate;
}

function gramwiz_clear() {
	gramwizIndex = [-1, -1];
	document.getElementById("gramwiz_input_suggest").innerHTML = "";
	document.getElementById("gw_1").innerHTML = "";
	document.getElementById("gw_2").innerHTML = "";
	document.getElementById("synth_result").innerHTML = "";
	document.getElementById("synth_sanskrit").innerHTML = "";
	document.getElementById("synth_gloss").innerHTML = "";
	document.getElementById("gramwiz_result").innerHTML = gramwizMainHTML;
}

function gramwiz_reverse() {
	if (gramwizIndex[0] == -1 || gramwizIndex[1] == -1) { return -1; }

	let i0 = gramwizIndex[0]; let i1 = gramwizIndex[1]; let t0 = document.getElementById("gw_1").innerHTML; let t1 = document.getElementById("gw_2").innerHTML;

	gramwizIndex = [i1, i0];
	document.getElementById("gw_1").innerHTML = t1;
	document.getElementById("gw_2").innerHTML = t0;

	accept_suggestion(-1, 0);
}

function gramwiz_sandhi(str_a, str_b) {
	const sandhi_before = ["a a", "a ā", "a i", "a ī", "a u", "a ū", "a ṛ", "a e", "a ai", "a o", "a au", "ā a", "ā ā", "ā i", "ā ī", "ā u", "ā ū", "ā ṛ", "ā e", "ā ai", "ā o", "ā au", "i a", "i ā", "i i", "i ī", "i u", "i ū", "i ṛ", "i e", "i ai", "i o", "i au", "ī a", "ī ā", "ī i", "ī ī", "ī u", "ī ū", "ī ṛ", "ī e", "ī ai", "ī o", "ī au", "u a", "u ā", "u i", "u ī", "u u", "u ū", "u ṛ", "u e", "u ai", "u o", "u au", "ū a", "ū ā", "ū i", "ū ī", "ū u", "ū ū", "ū ṛ", "ū e", "ū ai", "ū o", "ū au", "ṛ a", "ṛ ā", "ṛ i", "ṛ ī", "ṛ u", "ṛ ū", "ṛ ṛ", "ṛ e", "ṛ ai", "ṛ o", "ṛ au", "e a", "e ā", "e i", "e ī", "e u", "e ū", "e ṛ", "e e", "e ai", "e o", "e au", "ai a", "ai ā", "ai i", "ai ī", "ai u", "ai ū", "ai ṛ", "ai e", "ai ai", "ai o", "ai au", "o a", "o ā", "o i", "o ī", "o u", "o ū", "o ṛ", "o e", "o ai", "o o", "o au", "au a", "au ā", "au i", "au ī", "au u", "au ū", "au ṛ", "au e", "au ai", "au o", "au au", "aḥ a", "aḥ ā", "aḥ i", "aḥ ī", "aḥ u", "aḥ ū", "aḥ ṛ", "aḥ e", "aḥ ai", "aḥ o", "aḥ au", "aḥ g", "aḥ gh", "aḥ h", "aḥ c", "aḥ ch", "aḥ j", "aḥ jh", "aḥ y", "aḥ ṭ", "aḥ ṭh", "aḥ ḍ", "aḥ ḍh", "aḥ r", "aḥ t", "aḥ th", "aḥ d", "aḥ dh", "aḥ n", "aḥ l", "aḥ b", "aḥ bh", "aḥ m", "aḥ v", "āḥ a", "āḥ ā", "āḥ i", "āḥ ī", "āḥ u", "āḥ ū", "āḥ ṛ", "āḥ e", "āḥ ai", "āḥ o", "āḥ au", "āḥ k", "āḥ kh", "āḥ g", "āḥ gh", "āḥ h", "āḥ c", "āḥ ch", "āḥ j", "āḥ jh", "āḥ y", "āḥ ṭ", "āḥ ṭh", "āḥ ḍ", "āḥ ḍh", "āḥ r", "āḥ t", "āḥ th", "āḥ d", "āḥ dh", "āḥ n", "āḥ l", "āḥ s", "āḥ b", "āḥ bh", "āḥ m", "āḥ v", "iḥ a", "iḥ ā", "iḥ i", "iḥ ī", "iḥ u", "iḥ ū", "iḥ ṛ", "iḥ e", "iḥ ai", "iḥ o", "iḥ au", "iḥ g", "iḥ gh", "iḥ h", "iḥ c", "iḥ ch", "iḥ j", "iḥ jh", "iḥ y", "iḥ ṭ", "iḥ ṭh", "iḥ ḍ", "iḥ ḍh", "iḥ r", "iḥ t", "iḥ th", "iḥ d", "iḥ dh", "iḥ n", "iḥ l", "iḥ b", "iḥ bh", "iḥ m", "iḥ v", "īḥ a", "īḥ ā", "īḥ i", "īḥ ī", "īḥ u", "īḥ ū", "īḥ ṛ", "īḥ e", "īḥ ai", "īḥ o", "īḥ au", "īḥ g", "īḥ gh", "īḥ h", "īḥ c", "īḥ ch", "īḥ j", "īḥ jh", "īḥ y", "īḥ ṭ", "īḥ ṭh", "īḥ ḍ", "īḥ ḍh", "īḥ r", "īḥ t", "īḥ th", "īḥ d", "īḥ dh", "īḥ n", "īḥ l", "īḥ b", "īḥ bh", "īḥ m", "īḥ v", "uḥ a", "uḥ ā", "uḥ i", "uḥ ī", "uḥ u", "uḥ ū", "uḥ ṛ", "uḥ e", "uḥ ai", "uḥ o", "uḥ au", "uḥ g", "uḥ gh", "uḥ h", "uḥ c", "uḥ ch", "uḥ j", "uḥ jh", "uḥ y", "uḥ ṭ", "uḥ ṭh", "uḥ ḍ", "uḥ ḍh", "uḥ r", "uḥ t", "uḥ th", "uḥ d", "uḥ dh", "uḥ n", "uḥ l", "uḥ b", "uḥ bh", "uḥ m", "uḥ v", "ūḥ a", "ūḥ ā", "ūḥ i", "ūḥ ī", "ūḥ u", "ūḥ ū", "ūḥ ṛ", "ūḥ e", "ūḥ ai", "ūḥ o", "ūḥ au", "ūḥ g", "ūḥ gh", "ūḥ h", "ūḥ c", "ūḥ ch", "ūḥ j", "ūḥ jh", "ūḥ y", "ūḥ ṭ", "ūḥ ṭh", "ūḥ ḍ", "ūḥ ḍh", "ūḥ r", "ūḥ t", "ūḥ th", "ūḥ d", "ūḥ dh", "ūḥ n", "ūḥ l", "ūḥ b", "ūḥ bh", "ūḥ m", "ūḥ v", "ṛḥ a", "ṛḥ ā", "ṛḥ i", "ṛḥ ī", "ṛḥ u", "ṛḥ ū", "ṛḥ ṛ", "ṛḥ e", "ṛḥ ai", "ṛḥ o", "ṛḥ au", "ṛḥ g", "ṛḥ gh", "ṛḥ h", "ṛḥ c", "ṛḥ ch", "ṛḥ j", "ṛḥ jh", "ṛḥ y", "ṛḥ ṭ", "ṛḥ ṭh", "ṛḥ ḍ", "ṛḥ ḍh", "ṛḥ r", "ṛḥ t", "ṛḥ th", "ṛḥ d", "ṛḥ dh", "ṛḥ n", "ṛḥ l", "ṛḥ b", "ṛḥ bh", "ṛḥ m", "ṛḥ v", "ṝḥ a", "ṝḥ ā", "ṝḥ i", "ṝḥ ī", "ṝḥ u", "ṝḥ ū", "ṝḥ ṛ", "ṝḥ e", "ṝḥ ai", "ṝḥ o", "ṝḥ au", "ṝḥ g", "ṝḥ gh", "ṝḥ h", "ṝḥ c", "ṝḥ ch", "ṝḥ j", "ṝḥ jh", "ṝḥ y", "ṝḥ ṭ", "ṝḥ ṭh", "ṝḥ ḍ", "ṝḥ ḍh", "ṝḥ r", "ṝḥ t", "ṝḥ th", "ṝḥ d", "ṝḥ dh", "ṝḥ n", "ṝḥ l", "ṝḥ b", "ṝḥ bh", "ṝḥ m", "ṝḥ v", "ḷḥ a", "ḷḥ ā", "ḷḥ i", "ḷḥ ī", "ḷḥ u", "ḷḥ ū", "ḷḥ ṛ", "ḷḥ e", "ḷḥ ai", "ḷḥ o", "ḷḥ au", "ḷḥ g", "ḷḥ gh", "ḷḥ h", "ḷḥ c", "ḷḥ ch", "ḷḥ j", "ḷḥ jh", "ḷḥ y", "ḷḥ ṭ", "ḷḥ ṭh", "ḷḥ ḍ", "ḷḥ ḍh", "ḷḥ r", "ḷḥ t", "ḷḥ th", "ḷḥ d", "ḷḥ dh", "ḷḥ n", "ḷḥ l", "ḷḥ b", "ḷḥ bh", "ḷḥ m", "ḷḥ v", "ḹḥ a", "ḹḥ ā", "ḹḥ i", "ḹḥ ī", "ḹḥ u", "ḹḥ ū", "ḹḥ ṛ", "ḹḥ e", "ḹḥ ai", "ḹḥ o", "ḹḥ au", "ḹḥ g", "ḹḥ gh", "ḹḥ h", "ḹḥ c", "ḹḥ ch", "ḹḥ j", "ḹḥ jh", "ḹḥ y", "ḹḥ ṭ", "ḹḥ ṭh", "ḹḥ ḍ", "ḹḥ ḍh", "ḹḥ r", "ḹḥ t", "ḹḥ th", "ḹḥ d", "ḹḥ dh", "ḹḥ n", "ḹḥ l", "ḹḥ b", "ḹḥ bh", "ḹḥ m", "ḹḥ v", "eḥ a", "eḥ ā", "eḥ i", "eḥ ī", "eḥ u", "eḥ ū", "eḥ ṛ", "eḥ e", "eḥ ai", "eḥ o", "eḥ au", "eḥ g", "eḥ gh", "eḥ h", "eḥ c", "eḥ ch", "eḥ j", "eḥ jh", "eḥ y", "eḥ ṭ", "eḥ ṭh", "eḥ ḍ", "eḥ ḍh", "eḥ r", "eḥ t", "eḥ th", "eḥ d", "eḥ dh", "eḥ n", "eḥ l", "eḥ b", "eḥ bh", "eḥ m", "eḥ v", "aiḥ a", "aiḥ ā", "aiḥ i", "aiḥ ī", "aiḥ u", "aiḥ ū", "aiḥ ṛ", "aiḥ e", "aiḥ ai", "aiḥ o", "aiḥ au", "aiḥ g", "aiḥ gh", "aiḥ h", "aiḥ c", "aiḥ ch", "aiḥ j", "aiḥ jh", "aiḥ y", "aiḥ ṭ", "aiḥ ṭh", "aiḥ ḍ", "aiḥ ḍh", "aiḥ r", "aiḥ t", "aiḥ th", "aiḥ d", "aiḥ dh", "aiḥ n", "aiḥ l", "aiḥ b", "aiḥ bh", "aiḥ m", "aiḥ v", "oḥ a", "oḥ ā", "oḥ i", "oḥ ī", "oḥ u", "oḥ ū", "oḥ ṛ", "oḥ e", "oḥ ai", "oḥ o", "oḥ au", "oḥ g", "oḥ gh", "oḥ h", "oḥ c", "oḥ ch", "oḥ j", "oḥ jh", "oḥ y", "oḥ ṭ", "oḥ ṭh", "oḥ ḍ", "oḥ ḍh", "oḥ r", "oḥ t", "oḥ th", "oḥ d", "oḥ dh", "oḥ n", "oḥ l", "oḥ b", "oḥ bh", "oḥ m", "oḥ v", "auḥ a", "auḥ ā", "auḥ i", "auḥ ī", "auḥ u", "auḥ ū", "auḥ ṛ", "auḥ e", "auḥ ai", "auḥ o", "auḥ au", "auḥ g", "auḥ gh", "auḥ h", "auḥ c", "auḥ ch", "auḥ j", "auḥ jh", "auḥ y", "auḥ ṭ", "auḥ ṭh", "auḥ ḍ", "auḥ ḍh", "auḥ r", "auḥ t", "auḥ th", "auḥ d", "auḥ dh", "auḥ n", "auḥ l", "auḥ b", "auḥ bh", "auḥ m", "auḥ v", "k k", "k kh", "k g", "k gh", "k h", "k c", "k ch", "k j", "k jh", "k y", "k ś", "k ṭ", "k ṭh", "k ḍ", "k ḍh", "k r", "k ṣ", "k t", "k th", "k d", "k dh", "k n", "k l", "k s", "k p", "k ph", "k b", "k bh", "k m", "k v", "ṭ k", "ṭ kh", "ṭ g", "ṭ gh", "ṭ h", "ṭ c", "ṭ ch", "ṭ j", "ṭ jh", "ṭ y", "ṭ ś", "ṭ ṭ", "ṭ ṭh", "ṭ ḍ", "ṭ ḍh", "ṭ r", "ṭ ṣ", "ṭ t", "ṭ th", "ṭ d", "ṭ dh", "ṭ n", "ṭ l", "ṭ s", "ṭ p", "ṭ ph", "ṭ b", "ṭ bh", "ṭ m", "ṭ v", "ṇ k", "ṇ kh", "ṇ g", "ṇ gh", "ṇ h", "ṇ c", "ṇ ch", "ṇ j", "ṇ jh", "ṇ y", "ṇ ś", "ṇ ṭ", "ṇ ṭh", "ṇ ḍ", "ṇ ḍh", "ṇ r", "ṇ ṣ", "ṇ t", "ṇ th", "ṇ d", "ṇ dh", "ṇ n", "ṇ l", "ṇ s", "ṇ p", "ṇ ph", "ṇ b", "ṇ bh", "ṇ m", "ṇ v", "r k", "r kh", "r g", "r gh", "r h", "r c", "r ch", "r j", "r jh", "r y", "r ś", "r ṭ", "r ṭh", "r ḍ", "r ḍh", "r r", "r ṣ", "r t", "r th", "r d", "r dh", "r n", "r l", "r s", "r p", "r ph", "r b", "r bh", "r m", "r v", "t k", "t kh", "t g", "t gh", "t h", "t c", "t ch", "t j", "t jh", "t y", "t ś", "t ṭ", "t ṭh", "t ḍ", "t ḍh", "t r", "t ṣ", "t t", "t th", "t d", "t dh", "t n", "t l", "t s", "t p", "t ph", "t b", "t bh", "t m", "t v", "n k", "n kh", "n g", "n gh", "n h", "n c", "n ch", "n j", "n jh", "n y", "n ś", "n ṭ", "n ṭh", "n ḍ", "n ḍh", "n r", "n ṣ", "n t", "n th", "n d", "n dh", "n n", "n l", "n s", "n p", "n ph", "n b", "n bh", "n m", "n v", "p k", "p kh", "p g", "p gh", "p h", "p c", "p ch", "p j", "p jh", "p y", "p ś", "p ṭ", "p ṭh", "p ḍ", "p ḍh", "p r", "p ṣ", "p t", "p th", "p d", "p dh", "p n", "p l", "p s", "p p", "p ph", "p b", "p bh", "p m", "p v", "m k", "m kh", "m g", "m gh", "m h", "m c", "m ch", "m j", "m jh", "m y", "m ś", "m ṭ", "m ṭh", "m ḍ", "m ḍh", "m r", "m ṣ", "m t", "m th", "m d", "m dh", "m n", "m l", "m s", "m p", "m ph", "m b", "m bh", "m m", "m v"];
	const sandhi_after = ["ā", "ā", "e", "e", "o", "o", "ar", "ai", "ai", "au", "au", "ā", "ā", "e", "e", "o", "o", "ar", "ai", "ai", "au", "au", "ya", "yā", "ī", "ī", "yu", "yū", "yṛ", "ye", "yai", "yo", "yau", "ya", "yā", "ī", "ī", "yu", "yū", "yṛ", "ye", "yai", "yo", "yau", "va", "vā", "vi", "vī", "ū", "ū", "vṛ", "ve", "vai", "vo", "vau", "va", "vā", "vi", "vī", "ū", "ū", "vṛ", "ve", "vai", "vo", "vau", "ra", "rā", "ri", "rī", "ru", "rū", "ṝ", "re", "rai", "ro", "rau", "e ’", "a ā", "a i", "a ī", "a u", "a ū", "a ṛ", "a e", "a ai", "a o", "a au", "ā a", "ā ā", "ā i", "ā ī", "ā u", "ā ū", "ā ṛ", "ā e", "ā ai", "ā o", "ā au", "o ’", "a ā", "a i", "a ī", "a u", "a ū", "a ṛ", "a e", "a ai", "a o", "a au", "āva", "āvā", "āvi", "āvī", "āvu", "āvū", "āvṛ", "āve", "āvai", "āvo", "āvau", "o ’", "a ā", "a i", "a ī", "a u", "a ū", "a ṛ", "a e", "a ai", "a o", "a au", "o g", "o gh", "o h", "aśc", "aśch", "o j", "o jh", "o y", "aṣṭ", "aṣṭh", "o ḍ", "o ḍh", "o r", "ast", "asth", "o d", "o dh", "o n", "o l", "o b", "o bh", "o m", "o v", "ā a", "ā ā", "ā i", "ā ī", "ā u", "ā ū", "ā ṛ", "ā e", "ā ai", "ā o", "ā au", "āh k", "āh kh", "ā g", "ā gh", "ā h", "āśc", "āśch", "ā j", "ā jh", "ā y", "āṣṭ", "āṣṭh", "ā ḍ", "ā ḍh", "ā r", "āst", "āsth", "ā d", "ā dh", "ā m", "ā l", "āh s", "ā b", "ā bh", "ā m", "ā v", "ira", "irā", "iri", "irī", "iru", "irū", "irṛ", "ire", "irai", "iro", "irau", "irg", "irgh", "irh", "iśc", "iśch", "irj", "irjh", "iry", "iṣṭ", "iṣṭh", "irḍ", "irḍh", "ir", "ist", "isth", "ird", "irdh", "irn", "irl", "irb", "irbh", "irm", "irv", "īra", "īrā", "īri", "īrī", "īru", "īrū", "īrṛ", "īre", "īrai", "īro", "īrau", "īrg", "īrgh", "īrh", "īśc", "īśch", "īrj", "īrjh", "īry", "īṣṭ", "īṣṭh", "īrḍ", "īrḍh", "īr", "īst", "īsth", "īrd", "īrdh", "īrn", "īrl", "īrb", "īrbh", "īrm", "īrv", "ura", "urā", "uri", "urī", "uru", "urū", "urṛ", "ure", "urai", "uro", "urau", "urg", "urgh", "urh", "uśc", "uśch", "urj", "urjh", "ury", "uṣṭ", "uṣṭh", "urḍ", "urḍh", "ur", "ust", "usth", "urd", "urdh", "urn", "url", "urb", "urbh", "urm", "urv", "ūra", "ūrā", "ūri", "ūrī", "ūru", "ūrū", "ūrṛ", "ūre", "ūrai", "ūro", "ūrau", "ūrg", "ūrgh", "ūrh", "ūśc", "ūśch", "ūrj", "ūrjh", "ūry", "ūṣṭ", "ūṣṭh", "ūrḍ", "ūrḍh", "ūr", "ūst", "ūsth", "ūrd", "ūrdh", "ūrn", "ūrl", "ūrb", "ūrbh", "ūrm", "ūrv", "ṛra", "ṛrā", "ṛri", "ṛrī", "ṛru", "ṛrū", "ṛrṛ", "ṛre", "ṛrai", "ṛro", "ṛrau", "ṛrg", "ṛrgh", "ṛrh", "ṛśc", "ṛśch", "ṛrj", "ṛrjh", "ṛry", "ṛṣṭ", "ṛṣṭh", "ṛrḍ", "ṛrḍh", "ṛr", "ṛst", "ṛsth", "ṛrd", "ṛrdh", "ṛrn", "ṛrl", "ṛrb", "ṛrbh", "ṛrm", "ṛrv", "ṝra", "ṝrā", "ṝri", "ṝrī", "ṝru", "ṝrū", "ṝrṛ", "ṝre", "ṝrai", "ṝro", "ṝrau", "ṝrg", "ṝrgh", "ṝrh", "ṝśc", "ṝśch", "ṝrj", "ṝrjh", "ṝry", "ṝṣṭ", "ṝṣṭh", "ṝrḍ", "ṝrḍh", "ṝr", "ṝst", "ṝsth", "ṝrd", "ṝrdh", "ṝrn", "ṝrl", "ṝrb", "ṝrbh", "ṝrm", "ṝrv", "ḷra", "ḷrā", "ḷri", "ḷrī", "ḷru", "ḷrū", "ḷrṛ", "ḷre", "ḷrai", "ḷro", "ḷrau", "ḷrg", "ḷrgh", "ḷrh", "ḷśc", "ḷśch", "ḷrj", "ḷrjh", "ḷry", "ḷṣṭ", "ḷṣṭh", "ḷrḍ", "ḷrḍh", "ḷr", "ḷst", "ḷsth", "ḷrd", "ḷrdh", "ḷrn", "ḷrl", "ḷrb", "ḷrbh", "ḷrm", "ḷrv", "ḹra", "ḹrā", "ḹri", "ḹrī", "ḹru", "ḹrū", "ḹrṛ", "ḹre", "ḹrai", "ḹro", "ḹrau", "ḹrg", "ḹrgh", "ḹrh", "ḹśc", "ḹśch", "ḹrj", "ḹrjh", "ḹry", "ḹṣṭ", "ḹṣṭh", "ḹrḍ", "ḹrḍh", "ḹr", "ḹst", "ḹsth", "ḹrd", "ḹrdh", "ḹrn", "ḹrl", "ḹrb", "ḹrbh", "ḹrm", "ḹrv", "era", "erā", "eri", "erī", "eru", "erū", "erṛ", "ere", "erai", "ero", "erau", "erg", "ergh", "erh", "eśc", "eśch", "erj", "erjh", "ery", "eṣṭ", "eṣṭh", "erḍ", "erḍh", "er", "est", "esth", "erd", "erdh", "ern", "erl", "erb", "erbh", "erm", "erv", "aira", "airā", "airi", "airī", "airu", "airū", "airṛ", "aire", "airai", "airo", "airau", "airg", "airgh", "airh", "aiśc", "aiśch", "airj", "airjh", "airy", "aiṣṭ", "aiṣṭh", "airḍ", "airḍh", "air", "aist", "aisth", "aird", "airdh", "airn", "airl", "airb", "airbh", "airm", "airv", "ora", "orā", "ori", "orī", "oru", "orū", "orṛ", "ore", "orai", "oro", "orau", "org", "orgh", "orh", "ośc", "ośch", "orj", "orjh", "ory", "oṣṭ", "oṣṭh", "orḍ", "orḍh", "or", "ost", "osth", "ord", "ordh", "orn", "orl", "orb", "orbh", "orm", "orv", "aura", "aurā", "auri", "aurī", "auru", "aurū", "aurṛ", "aure", "aurai", "auro", "aurau", "aurg", "aurgh", "aurh", "auśc", "auśch", "aurj", "aurjh", "aury", "auṣṭ", "auṣṭh", "aurḍ", "aurḍh", "aur", "aust", "austh", "aurd", "aurdh", "aurn", "aurl", "aurb", "aurbh", "aurm", "aurv", "kk", "kkh", "gg", "ggh", "gh", "kc", "kch", "gj", "gjh", "gy", "kś", "kṭ", "kṭh", "gḍ", "gḍh", "gr", "kṣ", "kt", "kth", "gd", "gdh", "ṅn", "gl", "ks", "kp", "kph", "gb", "gbh", "ṅm", "gv", "ṭk", "ṭkh", "ḍg", "ḍgh", "ḍh", "ṭc", "ṭch", "ḍj", "ḍjh", "ḍy", "ṭś", "ṭṭ", "ṭṭh", "ḍḍ", "ḍḍh", "ḍr", "ṭṣ", "ṭt", "ṭth", "ḍd", "ḍdh", "ṇn", "ḍl", "ṭs", "ṭp", "ṭph", "ḍb", "ḍbh", "ṇm", "ḍv", "ṇk", "ṇkh", "ṇg", "ṇgh", "ṇh", "ṇc", "ṇch", "ṇj", "ṇjh", "ṇy", "ṇś", "ṇṭ", "ṇṭh", "ṇḍ", "ṇḍh", "ṇr", "ṇṣ", "ṇt", "ṇth", "ṇd", "ṇdh", "ṇn", "ṇl", "ṇs", "ṇp", "ṇph", "ṇb", "ṇbh", "ṇm", "ṇv", "ḥ k", "ḥ kh", "rg", "rgh", "rh", "śc", "śch", "rj", "rjh", "ry", "ḥ ś", "ṣṭ", "ṣṭh", "rḍ", "rḍh", "r", "ḥ ṣ", "st", "sth", "rd", "rdh", "rn", "rl", "ḥ s", "ḥ p", "ḥ ph", "rb", "rbh", "rm", "rv", "tk", "tkh", "dg", "dgh", "dh", "cc", "cch", "jj", "jjh", "dy", "cś", "ṭṭ", "ṭṭh", "ḍḍ", "ḍḍh", "drr", "tṣ", "tt", "tth", "dd", "ddh", "nn", "ll", "ts", "tp", "tph", "db", "dbh", "nm", "dv", "nk", "nkh", "ng", "ngh", "nh", "ṃśc", "ṃśch", "ñj", "ñjh", "ny", "ñś", "ṃṣṭ", "ṃṣṭh", "ṇḍ", "ṇḍh", "nr", "nṣ", "ṃst", "ṃsth", "nd", "ndh", "nn", "ṃll", "ns", "np", "nph", "nb", "nbh", "nm", "nv", "pk", "pkh", "bg", "bgh", "bh", "pc", "pch", "bj", "bjh", "by", "pś", "pṭ", "pṭh", "bḍ", "bḍh", "br", "pṣ", "pt", "pth", "bd", "bdh", "mn", "bl", "ps", "pp", "pph", "bb", "bbh", "mm", "bv", "ṃ k", "ṃ kh", "ṃ g", "ṃ gh", "ṃ h", "ṃ c", "ṃ ch", "ṃ j", "ṃ jh", "ṃ y", "ṃ ś", "ṃ ṭ", "ṃ ṭh", "ṃ ḍ", "ṃ ḍh", "ṃ r", "ṃ ṣ", "ṃ t", "ṃ th", "ṃ d", "ṃ dh", "ṃ n", "ṃ l", "ṃ s", "ṃ p", "ṃ ph", "ṃ b", "ṃ bh", "ṃ m", "ṃ v"];

	let result = str_a + ` ` + str_b;

	let took_sandhi = false;
	for (let i = 0; i < sandhi_before.length; i ++) {
		if (result.lastIndexOf(sandhi_before[i]) >= 0) {
			result = result.replaceAll(sandhi_before[i], sandhi_after[i]);
			took_sandhi = true;
			break;
		}
	}

	if (took_sandhi == false) {
		result = str_a + `&shy; ` + str_b;
	}

	result = result.replaceAll(" ", "");
	return result;
}