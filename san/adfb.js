function load_adfb(call = false) {
	let text = "";

	if (call == false) {
		text = document.getElementById("text").value;
		document.getElementById("text").value = "";
	}
	else {
		text = call;
	}

	text = text.trim();

	//filter bad words
	const badSearch = ["", " ", "=", ".", ",", ";", ":", "/"];
	if (badSearch.includes(text)) { return -1; }

	//special commands
	let query_command = load_query_command(text, call);
	if (query_command == true) { return -1; }
	
	//exacts
	let index = -1;

	//very exact
	for (let i = 0; i < dict.length; i ++) {
		let t = text.toLowerCase();
		let d1 = grid(dict, column.title, i).toLowerCase();
		let d2 = grid(dict, column.key, i).toLowerCase();

		if (t == d1 || t == d2) { index = i; break; }
	}

	//less exact
	if (index == -1) { for (let i = 0; i < dict.length; i ++) {
		let t = text.toLowerCase();
		let d1 = remove_diacritics(grid(dict, column.title, i).toLowerCase());
		let d2 = remove_diacritics(grid(dict, column.key, i).toLowerCase());

		if (t == d1 || t == d2) { index = i; break; }
	} }

	//undo stack
	if (call == false) {
		if (index >= 0) { undo_stack(grid(dict, column.key, index)); }
		else { undo_stack(text); }
	}

	//hangul => reverse db
	let regexHan = /[가-힣]/;
	if (regexHan.test(text)) {
		load_query_rv(text, "ko");
		return -1;
	}

	//en: command => reverse db
	else if (text.startsWith("en:")) {
		load_query_rv(text, "en");
		return -1;
	}

	let text_search = text.split("_")[0];
	load_query_suggest(text_search); load_query_include(text_search);

	topmenu_set_graphic("topmenu_dict");
	show_page(["search_form", "suggestions"], ["propertysettings", "not_found", "ADFB", "abc", "gw_inp", "mainpage"]);

	if (index == -1) {
		//not found
		show_page(["not_found"], ["ADFB", "abc"]);
	}
	else {
		//found
		show_page(["ADFB", "abc"], ["not_found"]);
	}

	// if got -1 immed. end
	if (index == -1) { return 0; }

///////////////////////////////////
//title
	let t1 = document.getElementsByClassName("ADFB_word_class")[0];
	if (grid(dict, column.class, index) == "m") {
		t1.innerHTML = "남성 명사.";
	}
	else if (grid(dict, column.class, index) == "f") {
		t1.innerHTML = "여성 명사.";
	}
	else if (grid(dict, column.class, index) == "n") {
		t1.innerHTML = "중성 명사.";
	}
	else if (grid(dict, column.class, index) == "a") {
		t1.innerHTML = "형용사.";
	}
	else if (grid(dict, column.class, index) == "i") {
		t1.innerHTML = "불변사.";
		document.getElementById("gram").innerHTML = "";
	}
	else if (grid(dict, column.class, index) == "v") {
		t1.innerHTML = "동사.";
		document.getElementById("gram").innerHTML = "";
	}
	else {
		t1.innerHTML = "ERR"
	}
	
///////////////////////////////////
//headword & favourites
	let t2 = document.getElementsByClassName("ADFB_head_word")[0];
	source_t2 = grid(dict, column.title, index) + "<sup>" + grid(dict, column.tag_homonym, index) + "</sup>" + "</small>" + `<span class="sanskrit">&nbsp;${LattoDev(grid(dict, column.title, index))}</span>`;
	if (!properties.showDevanagari) {
		source_t2 = source_t2.replaceAll(/<span class="sanskrit">.*?<\/span>/g, "");
	}
	t2.innerHTML = source_t2;
	
	let t3 = document.getElementsByClassName("ADFB_head_sound")[0];
	t3.innerHTML = "<span class=\"IPA\">[" + showPronounce(grid(dict, column.title, index), true) + "]</span>";

	let t4 = document.getElementById("ADFB_head_favourites");
	let t4_check = check_favourites(index) ? "★" : "☆";
	t4.innerHTML = "&nbsp;&nbsp;<span><a class=\"add_favourites\" onclick=\"add_favourites(" + index + ")\">" + t4_check + "</a></span>"

///////////////////////////////////
//grammar
	let word_class = grid(dict, column.class, index);
	let source_gram = "";

	//make grammar array
	let gram = []; let sound = [];
	for (let i = 0; column.grammar + i < column.length; i ++) {
		gram.push(grid(dict, column.grammar + i, index));
		sound.push("[" + showPronounce(gram[i], true) + "]");
	}

	if (word_class == "n" || word_class == "f" || word_class == "m") {
		source_gram = "<details><summary style=\"font-size: 18px;\">문법 정보 보기</summary><p>";

		source_gram += `<p><strong>합성형</strong>: <strong>${gram[0]}</strong> <span class="sanskrit">${LattoDev(gram[0])}</span> <span class="IPA"><small>${sound[0]}</small></span></p>`;

		if (word_class == "m") {
			source_gram += `<p><strong>단독형</strong></p>
				<table style="margin-left: 30px; margin-top: -30px;">
					<tr>
						<th>단수<small>(하나)</small></th>
						<th>쌍수<small>(둘)</small></th>
						<th>복수<small>(셋 이상)</small></th>
					</tr>
					<tr>
						<td><p><strong>${gram[1]}</strong></p><p class="sanskrit">${LattoDev(gram[1])}</p><p class="IPA"><small>${sound[1]}</small></p></td>
						<td><p><strong>${gram[4]}</strong></p><p class="sanskrit">${LattoDev(gram[4])}</p><p class="IPA"><small>${sound[4]}</small></p></td>
						<td><p><strong>${gram[7]}</strong></p><p class="sanskrit">${LattoDev(gram[7])}</p><p class="IPA"><small>${sound[7]}</small></p></td>
					</tr>
				</table>`;
		}
		else if (word_class == "f") {
			source_gram += `<p><strong>단독형</strong></p>
				<table style="margin-left: 30px; margin-top: -30px;">
					<tr>
						<th>단수<small>(하나)</small></th>
						<th>쌍수<small>(둘)</small></th>
						<th>복수<small>(셋 이상)</small></th>
					</tr>
					<tr>
						<td><p><strong>${gram[2]}</strong></p><p class="sanskrit">${LattoDev(gram[2])}</p><p class="IPA"><small>${sound[2]}</small></p></td>
						<td><p><strong>${gram[5]}</strong></p><p class="sanskrit">${LattoDev(gram[5])}</p><p class="IPA"><small>${sound[5]}</small></p></td>
						<td><p><strong>${gram[8]}</strong></p><p class="sanskrit">${LattoDev(gram[8])}</p><p class="IPA"><small>${sound[8]}</small></p></td>
					</tr>
				</table>`;
		}
		else if (word_class == "n") {
			source_gram += `<p><strong>단독형</strong></p>
				<table style="margin-left: 30px; margin-top: -30px;">
					<tr>
						<th>단수<small>(하나)</small></th>
						<th>쌍수<small>(둘)</small></th>
						<th>복수<small>(셋 이상)</small></th>
					</tr>
					<tr>
						<td><p><strong>${gram[3]}</strong></p><p class="sanskrit">${LattoDev(gram[3])}</p><p class="IPA"><small>${sound[3]}</small></p></td>
						<td><p><strong>${gram[6]}</strong></p><p class="sanskrit">${LattoDev(gram[6])}</p><p class="IPA"><small>${sound[6]}</small></p></td>
						<td><p><strong>${gram[9]}</strong></p><p class="sanskrit">${LattoDev(gram[9])}</p><p class="IPA"><small>${sound[9]}</small></p></td>
					</tr>
				</table>`;
		}

		source_gram +=  `</details>`;
	}
	else if (word_class == "a") {
		source_gram = "<details><summary style=\"font-size: 18px;\">문법 정보 보기</summary><p>";

		source_gram += `<p><strong>합성형</strong>: <strong>${gram[0]}</strong> <span class="sanskrit">${LattoDev(gram[0])}</span> <span class="IPA"><small>${sound[0]}</small></span></p>`;

		source_gram += `<p><strong>남성 단독형</strong></p>
			<table style="margin-left: 30px; margin-top: -30px;">
				<tr>
					<th>단수<small>(하나)</small></th>
					<th>쌍수<small>(둘)</small></th>
					<th>복수<small>(셋 이상)</small></th>
				</tr>
				<tr>
					<td><p><strong>${gram[1]}</strong></p><p class="sanskrit">${LattoDev(gram[1])}</p><p class="IPA"><small>${sound[1]}</small></p></td>
					<td><p><strong>${gram[4]}</strong></p><p class="sanskrit">${LattoDev(gram[4])}</p><p class="IPA"><small>${sound[4]}</small></p></td>
					<td><p><strong>${gram[7]}</strong></p><p class="sanskrit">${LattoDev(gram[7])}</p><p class="IPA"><small>${sound[7]}</small></p></td>
				</tr>
			</table>`;

		source_gram += `<p><strong>여성 단독형</strong></p>
			<table style="margin-left: 30px; margin-top: -30px;">
				<tr>
					<th>단수<small>(하나)</small></th>
					<th>쌍수<small>(둘)</small></th>
					<th>복수<small>(셋 이상)</small></th>
				</tr>
				<tr>
					<td><p><strong>${gram[2]}</strong></p><p class="sanskrit">${LattoDev(gram[2])}</p><p class="IPA"><small>${sound[2]}</small></p></td>
					<td><p><strong>${gram[5]}</strong></p><p class="sanskrit">${LattoDev(gram[5])}</p><p class="IPA"><small>${sound[5]}</small></p></td>
					<td><p><strong>${gram[8]}</strong></p><p class="sanskrit">${LattoDev(gram[8])}</p><p class="IPA"><small>${sound[8]}</small></p></td>
				</tr>
			</table>`;

		source_gram += `<p><strong>중성 단독형</strong></p>
			<table style="margin-left: 30px; margin-top: -30px;">
				<tr>
					<th>단수<small>(하나)</small></th>
					<th>쌍수<small>(둘)</small></th>
					<th>복수<small>(셋 이상)</small></th>
				</tr>
				<tr>
					<td><p><strong>${gram[3]}</strong></p><p class="sanskrit">${LattoDev(gram[3])}</p><p class="IPA"><small>${sound[3]}</small></p></td>
					<td><p><strong>${gram[6]}</strong></p><p class="sanskrit">${LattoDev(gram[6])}</p><p class="IPA"><small>${sound[6]}</small></p></td>
					<td><p><strong>${gram[9]}</strong></p><p class="sanskrit">${LattoDev(gram[9])}</p><p class="IPA"><small>${sound[9]}</small></p></td>
				</tr>
			</table>`;
	}

	source_gram = source_gram.replaceAll("[]", "&nbsp;");
	if (!properties.showDevanagari) {
		source_gram = source_gram.replaceAll(/<span class="sanskrit">.*?<\/span>/g, "");
		source_gram = source_gram.replaceAll(/<p class="sanskrit">.*?<\/p>/g, "");
	}

	document.getElementById("gram").innerHTML = source_gram;

///////////////////////////////////
//korean gloss
	let e1 = document.getElementsByClassName("ADFB_gloss_ko")[0];
	let gloss_ko = grid(dict, column.gloss_ko, index).split("<br>");
	let source_e1 = "";
	for (let i = 0; i < gloss_ko.length; i ++) {
		source_e1 += "<strong>" + (i + 1).toString() + "</strong>. " + gloss_ko[i] + "<br>";
	}
	e1.innerHTML = source_e1;

///////////////////////////////////
//english gloss
	let e2 = document.getElementsByClassName("ADFB_gloss_en")[0];
	let gloss_en = grid(dict, column.gloss_en, index).split("<br>");
	let source_e2 = "";
	for (let i = 0; i < gloss_en.length; i ++) {
		source_e2 += "<strong>" + (i + 1).toString() + "</strong>. " + gloss_en[i] + "<br>";
	}
	e2.innerHTML = source_e2;

///////////////////////////////////
//encyclopaedia
	let e3 = document.getElementsByClassName("ADFB_gloss_ep_isExist")[0];
	if (grid(dict, column.gloss_ep, index).length > 1) {
		e3.innerHTML = "«해설»";
		document.getElementById("ADFB_gloss_ep_isExist_hr").style.display = "block";
	}
	else {
		e3.innerHTML = "";
		document.getElementById("ADFB_gloss_ep_isExist_hr").style.display = "none";
	}

	let e4 = document.getElementsByClassName("ADFB_gloss_ep")[0];
	e4.innerHTML = grid(dict, column.gloss_ep, index);

///////////////////////////////////
//set ABC;
	let source_abc = "<br><hr>"
	let number_abc = 4; //how many words?

	for (let i = -number_abc; i <= number_abc; i ++) {
		let link = grid(dict, column.key, index + i);
		let t0 = grid(dict, column.title, index + i);
		let t1 = grid(dict, column.tag_homonym, index + i);

		let text = t0 + "<sup>" + t1 + "</sup>";

		//too forth or back; no word to show
		if (t0 == "") { continue; }

		if (i != 0) {
			source_abc += "<a onclick=\"link('" + link + "')\">" + text + "</a>";
		}
		else {
			source_abc += "<strong><a onclick=\"link('" + link + "')\">" + text + "</a></strong>";
		}
		
		source_abc += " · ";
	}

	if (source_abc.endsWith(" · ")) {
		source_abc = source_abc.slice(0, -3);
	}

	document.getElementById("abc").innerHTML = source_abc;
}

//역방향 검색
function load_query_rv(text, lang) {
	topmenu_set_graphic("topmenu_dict");

	text = text.trim().replaceAll(" ", "").toLowerCase();
	if (lang == "en") { text = text.replace("en:", ""); }

	let List = [];

	for (let i = 0; i < dict.length; i ++) {
		let line = db_text[i].toLowerCase();

		if (line.includes(text)) {
			let gloss = "";
			if (lang == "ko") {
				gloss = grid(dict, column.gloss_ko, i).replaceAll("<br>", "; ");
			}
			else if (lang == "en") {
				gloss = grid(dict, column.gloss_en, i).replaceAll("<br>", "; ");
			}
			List.push([i, gloss]);
		}
	}

	show_page(["search_form"], ["suggestions", "mainpage", "propertysettings", "ADFB", "abc"]);

	if (List.length == 0) {
		show_page(["not_found"], ["includes"]);
		return 0;
	}
	else {
		show_page(["includes"], ["not_found"]);
	}

	let source = "";

	for (let i = 0; i < List.length; i ++) {
		let t1 = grid(dict, column.key, List[i][0]);
		let t2 = grid(dict, column.title, List[i][0])
		let t3 = showPronounce(t2, true);
		let check = check_favourites(List[i][0]) ? "★" : "☆";

		source += `<p><a class="add_favourites" id="ABC_fav_${List[i][0].toString().padStart(5, '0')}" onclick="add_favourites(${List[i][0]})" style="font-family: 'Charis SIL'">${check}</a>&nbsp;<strong><a onclick="link('${t1}')">${t2}</a></strong>&nbsp;<span class="IPA">[${t3}]&nbsp;:&nbsp;&nbsp;${List[i][1]}</p></span>`;
	}

	document.getElementById("includes_search").innerHTML = source;
}

//부분일치
function load_query_include(text) {
	topmenu_set_graphic("topmenu_dict");

	let List = [];

	//원 단어 + 이 글자수까지만 찾는다. 안 그러면 짧은 검색어에선 미친듯이 폭발함...
	let length_max = 10;
	
	switch (text.length) {
		case 1: length_max = 3; break;
		case 2: length_max = 5; break;
		case 3: length_max = 8; break;
	}

	for (let i = 0; i < dict.length; i ++) {
		if (grid(dict, column.title, i).toLowerCase().includes(text.toLowerCase()) && grid(dict, column.key, i) != Page && grid(dict, column.title, i).length <= text.length + length_max) {
			List.push(i);
		}
	}

	show_page([], ["propertysettings"]);

	if (List.length == 0) {
		show_page([], ["includes"]);
		return 0;
	}
	else {
		show_page(["includes"], []);
	}

	let source = "";

	for (let i = 0; i < List.length; i ++) {
		let link = grid(dict, column.key, List[i]);
		let t0 = grid(dict, column.title, List[i]);
		let t1 = grid(dict, column.tag_homonym, List[i]);

		let t = t0 + "<sup>" + t1 + "</sup>";

		//동음이의어
		let t2 = Page.split("_")[0];

		if (t0 == t2) {
			source += "<strong><a onclick=\"link('" + link + "')\">" + t + "</a></strong>";
		}
		else {
			source += "<a onclick=\"link('" + link + "')\">" + t + "</a>";
		}

		if (i < List.length - 1) {
			source += " · ";
		}
	}

	document.getElementById("includes_search").innerHTML = source;
}

//유사 검색어
function load_query_suggest(text) {
	topmenu_set_graphic("topmenu_dict");

	let List = [];

	for (let i = 0; i < dict.length; i ++) {
		//정확히 같은 단어는 걸러
		if (Page.toLowerCase() == grid(dict, column.key, i).toLowerCase()) {
			List.push(0); continue;
		}

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

			let sq = false;
			let sq_tuple = [["a", "ā"], ["i", "ī"], ["u", "ū"], ["r", "ṛ"], ["r", "ṝ"], ["ṛ", "ṝ"], ["l", "ḷ"], ["l", "ḹ"], ["ḷ", "ḹ"], ["m", "ṃ"], ["h", "ḥ"], ["n", "ṇ"], ["n", "ṅ"], ["n", "ñ"], ["ṇ", "ṅ"], ["ṇ", "ñ"], ["ṅ", "ñ"], ["s", "ś"], ["s", "ṣ"], ["ś", "ṣ"], ["t", "ṭ"], ["d", "ḍ"]];

			for (let k = 0; k < sq_tuple.length; k ++) {
				if ((chr1 == sq_tuple[k][0] && chr2 == sq_tuple[k][1]) || (chr1 == sq_tuple[k][1] && chr2 == sq_tuple[k][0])) {
					sq = true; break;
				}
			}
			
			if (sq) { l1 += 0.5; }
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

	let source = "";
	
	for (let i = 0; i < IndexRemoveDuplicate.length; i ++) {
		if (IndexRemoveDuplicate[i] == -1) { continue; }

		let link = grid(dict, column.key, IndexRemoveDuplicate[i]);
		let t0 = grid(dict, column.title, IndexRemoveDuplicate[i]);
		let t1 = grid(dict, column.tag_homonym, IndexRemoveDuplicate[i]);

		let t = t0 + "<sup>" + t1 + "</sup>";

		//동음이의어
		let t2 = Page.split("_")[0];

		if (t0 == t2) {
			source += "<strong><a onclick=\"link('" + link + "')\">" + t + "</a></strong>";
		}
		else {
			source += "<a onclick=\"link('" + link + "')\">" + t + "</a>";
		}


		if (i < IndexRemoveDuplicate.length - 1) {
			source += " · "
		}
	}

	document.getElementById("suggestions_search").innerHTML = source;
}

//특수 검색어
function load_query_command(text, call) {
	if (text == "#main") {
		load_main(call); return true;
	}
	else if (text == "#gramwiz") {
		load_gramwiz_main(call); return true;
	}
	else if (text == "#property") {
		load_property(call); return true;
	}
	else if (text == "#favourites") {
		load_favourites(call); return true;
	}
	else if (text.includes("#") && text.length == 2 && text.charAt(1).toUpperCase() == text.charAt(1)) {
		load_abc(text.charAt(1), call); return true;
	}
	else if (text.includes("#appendix")) {
		load_appendix(text, call); return true;
	}

	return false;
}