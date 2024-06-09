document.getElementById("submit").onclick = function() {
	let index = findExact();

	//-1을 받았다면 그대로 종료
	if (index == -1) { return 0; }

	/*범례
	0: key			1: 사전형	2: 품사		3: 영어		4: 한국어		5: 해설
	6: 예문			7: 문법-합성형			8 - 13: (명)단독형 (형)남성형
	14 - 19: (형)여성형			20 - 25: (형)중성형

	문법 순서: 단수주격 - 쌍수주격 - 복수주격 - 단수속격 - 쌍수속격 - 복수속격
	*/

	//set ADFB
	let t1 = document.getElementsByClassName("ADFB_word_class")[0];
	if (grid(dict, 2, index) == "m") {
		t1.innerHTML = "남성 명사.";
	}
	else if (grid(dict, 2, index) == "f") {
		t1.innerHTML = "여성 명사.";
	}
	else if (grid(dict, 2, index) == "n") {
		t1.innerHTML = "중성 명사.";
	}
	else if (grid(dict, 2, index) == "a") {
		t1.innerHTML = "형용사.";
	}
	else {
		t1.innerHTML = "ERR"
	}
	
	//표제어
	let t2 = document.getElementsByClassName("ADFB_head_word")[0];
	t2.innerHTML = grid(dict, 1, index);
	let t3 = document.getElementsByClassName("ADFB_head_sound")[0];
	t3.innerHTML = "[" + GetHangul(grid(dict, 1, index), true) + "]";

	//문법
	let word_class = grid(dict, 2, index);
	let source_gram = "";

	if (word_class == "m" || word_class == "f" || word_class == "n") {
		let g1 = grid(dict, 7, index);
		let g2 = "[" + GetHangul(g1, true) + "]";

		let g3 = grid(dict, 8, index);
		let g4 = "[" + GetHangul(g3, true) + "]";
		let g5 = grid(dict, 9, index);
		let g6 = "[" + GetHangul(g5, true) + "]";
		let g7 = grid(dict, 10, index);
		let g8 = "[" + GetHangul(g7, true) + "]";

		let g9 = grid(dict, 11, index);
		let g10 = "[" + GetHangul(g9, true) + "]";
		let g11 = grid(dict, 12, index);
		let g12 = "[" + GetHangul(g11, true) + "]";
		let g13 = grid(dict, 13, index);
		let g14 = "[" + GetHangul(g13, true) + "]";

		source_gram = "<details><summary style=\"font-size: 18px;\">문법 정보 보기</summary><p><strong>합성형</strong>: <strong>" + g1 + "-</strong>&nbsp;" + g2 + "</p><p><strong>단독형</strong></p>";

		source_gram = source_gram + "<table><tr><td>&nbsp;</td><td><strong>단수</strong><sub>(하나)</sub></td><td><strong>쌍수</strong><sub>(둘)</sub></td><td><strong>복수</strong><sub>(셋 이상)</sub></td></tr>";
		source_gram = source_gram + "<tr><td><strong>주격</strong><sub>(~이/가)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g3 + "</strong></p><small class=\"IPA\">" + g4 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g5 + "</strong></p><small class=\"IPA\">" + g6 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g7 + "</strong></p><small class=\"IPA\">" + g8 + "</small></p></td></tr>";
		source_gram = source_gram + "<tr><td><strong>속격</strong><sub>(~의)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g9 + "</strong></p><small class=\"IPA\">" + g10 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g11 + "</strong></p><small class=\"IPA\">" + g12 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g13 + "</strong></p><small class=\"IPA\">" + g14 + "</small></p></td></tr>";
		source_gram = source_gram + "</table><p></p></details>";
	}
	else if (word_class == "a") {
		let g1 = grid(dict, 7, index);
		let g2 = "[" + GetHangul(g1, true) + "]";

		let g3 = grid(dict, 8, index);
		let g4 = "[" + GetHangul(g3, true) + "]";
		let g5 = grid(dict, 9, index);
		let g6 = "[" + GetHangul(g5, true) + "]";
		let g7 = grid(dict, 10, index);
		let g8 = "[" + GetHangul(g7, true) + "]";

		let g9 = grid(dict, 11, index);
		let g10 = "[" + GetHangul(g9, true) + "]";
		let g11 = grid(dict, 12, index);
		let g12 = "[" + GetHangul(g11, true) + "]";
		let g13 = grid(dict, 13, index);
		let g14 = "[" + GetHangul(g13, true) + "]";

		let g15 = grid(dict, 14, index);
		let g16 = "[" + GetHangul(g15, true) + "]";
		let g17 = grid(dict, 15, index);
		let g18 = "[" + GetHangul(g17, true) + "]";
		let g19 = grid(dict, 16, index);
		let g20 = "[" + GetHangul(g19, true) + "]";

		let g21 = grid(dict, 17, index);
		let g22 = "[" + GetHangul(g21, true) + "]";
		let g23 = grid(dict, 18, index);
		let g24 = "[" + GetHangul(g23, true) + "]";
		let g25 = grid(dict, 19, index);
		let g26 = "[" + GetHangul(g25, true) + "]";

		let g27 = grid(dict, 20, index);
		let g28 = "[" + GetHangul(g27, true) + "]";
		let g29 = grid(dict, 21, index);
		let g30 = "[" + GetHangul(g29, true) + "]";
		let g31 = grid(dict, 22, index);
		let g32 = "[" + GetHangul(g31, true) + "]";

		let g33 = grid(dict, 23, index);
		let g34 = "[" + GetHangul(g33, true) + "]";
		let g35 = grid(dict, 24, index);
		let g36 = "[" + GetHangul(g35, true) + "]";
		let g37 = grid(dict, 25, index);
		let g38 = "[" + GetHangul(g37, true) + "]";

		source_gram = "<details><summary style=\"font-size: 18px;\">문법 정보 보기</summary><p><strong>합성형</strong>: <strong>" + g1 + "-</strong>&nbsp;" + g2 + "</p>";

		source_gram = source_gram + "<p><strong>남성형</strong></p>";
		source_gram = source_gram + "<table><tr><td>&nbsp;</td><td><strong>단수</strong><sub>(하나)</sub></td><td><strong>쌍수</strong><sub>(둘)</sub></td><td><strong>복수</strong><sub>(셋 이상)</sub></td></tr>";
		source_gram = source_gram + "<tr><td><strong>주격</strong><sub>(~이/가)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g3 + "</strong></p><small class=\"IPA\">" + g4 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g5 + "</strong></p><small class=\"IPA\">" + g6 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g7 + "</strong></p><small class=\"IPA\">" + g8 + "</small></p></td></tr>";
		source_gram = source_gram + "<tr><td><strong>속격</strong><sub>(~의)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g9 + "</strong></p><small class=\"IPA\">" + g10 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g11 + "</strong></p><small class=\"IPA\">" + g12 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g13 + "</strong></p><small class=\"IPA\">" + g14 + "</small></p></td></tr></table>";

		source_gram = source_gram + "<br><p><strong>여성형</strong></p>";
		source_gram = source_gram + "<table><tr><td>&nbsp;</td><td><strong>단수</strong><sub>(하나)</sub></td><td><strong>쌍수</strong><sub>(둘)</sub></td><td><strong>복수</strong><sub>(셋 이상)</sub></td></tr>";
		source_gram = source_gram + "<tr><td><strong>주격</strong><sub>(~이/가)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g15 + "</strong></p><small class=\"IPA\">" + g16 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g17 + "</strong></p><small class=\"IPA\">" + g18 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g19 + "</strong></p><small class=\"IPA\">" + g20 + "</small></p></td></tr>";
		source_gram = source_gram + "<tr><td><strong>속격</strong><sub>(~의)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g21 + "</strong></p><small class=\"IPA\">" + g22 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g23 + "</strong></p><small class=\"IPA\">" + g24 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g25 + "</strong></p><small class=\"IPA\">" + g26 + "</small></p></td></tr></table>";

		source_gram = source_gram + "<br><p><strong>중성형</strong></p>";
		source_gram = source_gram + "<table><tr><td>&nbsp;</td><td><strong>단수</strong><sub>(하나)</sub></td><td><strong>쌍수</strong><sub>(둘)</sub></td><td><strong>복수</strong><sub>(셋 이상)</sub></td></tr>";
		source_gram = source_gram + "<tr><td><strong>주격</strong><sub>(~이/가)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g27 + "</strong></p><small class=\"IPA\">" + g28 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g29 + "</strong></p><small class=\"IPA\">" + g30 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g31 + "</strong></p><small class=\"IPA\">" + g32 + "</small></p></td></tr>";
		source_gram = source_gram + "<tr><td><strong>속격</strong><sub>(~의)</sub></td>";
		source_gram = source_gram + "<td><p><strong>" + g33 + "</strong></p><small class=\"IPA\">" + g34 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g35 + "</strong></p><small class=\"IPA\">" + g36 + "</small></p></td>";
		source_gram = source_gram + "<td><p><strong>" + g37 + "</strong></p><small class=\"IPA\">" + g38 + "</small></p></td></tr></table>";

		source_gram = source_gram + "<p></p></details>";
	}

	document.getElementById("gram").innerHTML = source_gram;

	//해설
	let e1 = document.getElementsByClassName("ADFB_gloss_ko")[0];
	let gloss_ko = grid(dict, 4, index).split("<br>");
	let source_e1 = "";
	for (var i = 0; i < gloss_ko.length; i ++) {
		source_e1 = source_e1 + "<strong>" + (i + 1).toString() + "</strong>. " + gloss_ko[i] + "<br>";
	}
	e1.innerHTML = source_e1;

	let e2 = document.getElementsByClassName("ADFB_gloss_en")[0];
	let gloss_en = grid(dict, 3, index).split("<br>");
	let source_e2 = "";
	for (var i = 0; i < gloss_en.length; i ++) {
		source_e2 = source_e2 + "<strong>" + (i + 1).toString() + "</strong>. " + gloss_en[i] + "<br>";
	}
	e2.innerHTML = source_e2;

	let e3 = document.getElementsByClassName("ADFB_gloss_ep_isExist")[0];
	if (grid(dict, 5, index).length > 1) {
		e3.innerHTML = "«해설»";
		document.getElementById("ADFB_gloss_ep_isExist_hr").style.display = "block";
	}
	else {
		e3.innerHTML = "";
		document.getElementById("ADFB_gloss_ep_isExist_hr").style.display = "none";
	}

	let e4 = document.getElementsByClassName("ADFB_gloss_ep")[0];
	e4.innerHTML = grid(dict, 5, index);

	let e5 = document.getElementsByClassName("ADFB_gloss_ex_isExist")[0];
	if (grid(dict, 6, index).length > 1) {
		e5.innerHTML = "«예문»";
		document.getElementById("ADFB_gloss_ex_isExist_hr").style.display = "block";
	}
	else {
		e5.innerHTML = "";
		document.getElementById("ADFB_gloss_ex_isExist_hr").style.display = "none";
	}

	let e6 = document.getElementsByClassName("ADFB_gloss_ex")[0];
	e6.innerHTML = grid(dict, 6, index);

	//set ABC
	let source_abc = "<br><hr>"
	for (var i = -4; i <= 4; i ++) {
		if (i != 0) {
			source_abc = source_abc + "<a onclick=\"link('" + grid(dict, 0, index + i) + "')\">" + grid(dict, 1, index + i) + "</a>";
		}
		else {
			source_abc = source_abc + "<strong><a onclick=\"link('" + grid(dict, 0, index + i) + "')\">" + grid(dict, 1, index + i) + "</a></strong>";
		}

		if (i < 4) {
			source_abc = source_abc + " · ";
		}
	}

	document.getElementById("abc").innerHTML = source_abc;
}