//반절표
const CH = ["X", "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ", "J", "L", "N", "S", "V"];
const VH = ["ㅏ", "ㅔ", "ㅣ", "ㅗ", "ㅜ", "ㅡ"];
const SH = ["아", "가", "까", "나", "다", "따", "라", "마", "바", "빠", "사", "자", "짜", "차", "카", "타", "파", "하", "야", "*라", "냐", "샤", "와", "에", "게", "께", "네", "데", "떼", "레", "메", "베", "뻬", "세", "제", "쩨", "체", "케", "테", "페", "헤", "예", "*레", "녜", "셰", "웨", "이", "기", "끼", "니", "디", "띠", "리", "미", "비", "삐", "시", "지", "찌", "치", "키", "티", "피", "히", "이", "*리", "니", "쉬", "위", "오", "고", "꼬", "노", "도", "또", "로", "모", "보", "뽀", "소", "조", "쪼", "초", "코", "토", "포", "호", "요", "*로", "뇨", "쇼", "보", "우", "구", "꾸", "누", "두", "뚜", "루", "무", "부", "뿌", "수", "주", "쭈", "추", "쿠", "투", "푸", "후", "유", "*루", "뉴", "슈", "우", "으", "그", "끄", "느", "드", "뜨", "르", "므", "브", "쁘", "스", "즈", "쯔", "츠", "크", "트", "프", "흐", "궳", "*르", "느", "쉬", "브"];
const Coda = ["ㄴ", "L", "ㅁ", "ㅇ", "κ", "τ", "π"];

function GetIPA(text, hideSyllableMark = false) {
	text = text.toLowerCase().trim().replace(/ṁ/g, "ṃ");
	text = text.replace(/\,|\.|\;|\:/g, "");

	let Forbidden = ["", "-", ".", ",", ";", ":", "!", "?", "~", "\"", "'"];
	if (Forbidden.includes(text)) { return ""; }

	const Element = [" ", "-", "|", "łl", "ai", "au", "kh", "gh", "ch", "jh", "ṭh", "ḍh", "th", "dh", "ph", "bh", "a", "ā", "i", "ī", "u", "ū", "ṛ", "ṝ", "ḷ", "ḹ", "e", "o", "ṃ", "ḥ", "'", "’", "k", "g", "ṅ", "h", "c", "j", "ñ", "y", "ś", "ṭ", "ḍ", "ṇ", "r", "ṣ", "ḻ", "t", "d", "n", "l", "s", "p", "b", "m", "ł", "v"];
	const Sound = [" ", " ", ".", "l̃", "ɑɪ̯", "ɑʊ̯", "kʰ", "ɡʱ", "ʨʰ", "ʥʱ", "ʈʰ", "ɖʱ", "tʰ", "dʱ", "pʰ", "bʱ", "ɐ", "ɑː", "ɪ", "iː", "ʊ", "uː", "r̩", "r̩ː", "l̩", "l̩ː", "eː", "oː", "N", "h", "", "", "k", "ɡ", "ŋ", "ɦ", "ʨ", "ʥ", "ɲ", "j", "ɕ", "ʈ", "ɖ", "ɳ", "ɾ", "ʂ", "ɭ", "t", "d", "n", "l", "s", "p", "b", "m", "N", "ʋ"];

	const parse_criteria = /(łl|ai|au|kh|gh|ch|jh|ṭh|ḍh|th|dh|ph|bh|a|ā|i|ī|u|ū|ṛ|ṝ|ḷ|ḹ|e|o|ṃ|ḥ|\'|k|g|ṅ|h|c|j|ñ|y|ś|ṭ|ḍ|ṇ|r|ṣ|ḻ|t|d|n|l|s|p|b|m|ł|v)/i;

	//change orthography
	text = text.replaceAll("cc", "tc");
	text = text.replaceAll("rttr", "rtr");

	//parse
	let text_parse = text.split(parse_criteria);
	text_parse = text_parse.filter(element => element !== "");

	//change
	let ipa_parse_total = [];
	for (var i = 0; i < text_parse.length; i ++) {
		let index = Element.indexOf(text_parse[i]);
		ipa_parse_total.push(Sound[index]);
	}

	//slice by word
	let ipa_parse = []; let subarray = [];
	for (let element of ipa_parse_total) {
		if (element === " ") {
			ipa_parse.push(subarray);
			subarray = [];
		}
		else {
			subarray.push(element);
		}
	}

	if (subarray.length > 0) {
		ipa_parse.push(subarray);
	}

	//mark all nuclei
	const PossibleNuclei = ["ɑɪ̯", "ɑʊ̯", "ɐ", "ɑː", "ɪ", "iː", "ʊ", "uː", "r̩", "r̩ː", "l̩", "l̩ː", "eː", "oː"];

	let ipa_string_array = [];

	for (var n = 0; n < ipa_parse.length; n ++) {
		let sound = ipa_parse[n];

		let nuclei_indices = [];
		for (var i = 0; i < sound.length; i ++) {
			if (PossibleNuclei.includes(sound[i])) {
				nuclei_indices.push(i);
			}
		}
	
	//possibility: V, VC, CV, CVC, CCV, CCVC
	//slice by V
		let Syllables = [];
		for (var i = 0; i < nuclei_indices.length; i ++) {
			let index = nuclei_indices[i]; let syllable = []; let limit = 0;
			if (i > 0) { limit = nuclei_indices[i - 1] + 1; }
	
			for (var j = limit; j <= index; j ++) {
				syllable.push(sound[j]);
			}
	
			Syllables.push(syllable);
		}
	
		Syllables.push([]);
	
		for (var j = nuclei_indices.at(-1) + 1; j < sound.length; j ++) {
			Syllables.at(-1).push(sound[j]);
		}
	
	//absorb ender consonant
		for (var i = 0; i < Syllables.length - 1; i ++) {
			//ends with nucleus, starts with twofold non-nucleus
			if (PossibleNuclei.includes(Syllables[i].at(-1)) && Syllables[i + 1].length >= 2 && !PossibleNuclei.includes(Syllables[i + 1][0]) && !PossibleNuclei.includes(Syllables[i + 1][1])) {
				Syllables[i].push(Syllables[i + 1].shift());
			}

			//ends with nucleus, final one with only non-nuclei
			else if (i == Syllables.length - 2) {
				Syllables[i] = Syllables[i].concat(Syllables.pop());
			}
		}

	//join
		for (var i = 0; i < Syllables.length; i ++) {
			Syllables[i] = Syllables[i].join("");
		}

		let ipa_string = Syllables.join(".");

		ipa_string_array.push(ipa_string);
	}

	let result = ipa_string_array.join(" ");

	//////////document.getElementById('output').value = result;

	//syllable mark
	if (hideSyllableMark == true){
		result = result.replaceAll(".", "");
	}

	//nasals
	result = result.replaceAll("ɐN", "ɐ̃");
	result = result.replaceAll("ɪN", "ɪ̃");
	result = result.replaceAll("iN", "ĩ");
	result = result.replaceAll("iːN", "ĩː");
	result = result.replaceAll("ʊN", "ʊ̃");
	result = result.replaceAll("uN", "ũ");
	result = result.replaceAll("uːN", "ũː");
	result = result.replaceAll("ɑːN", "ɑ̃ː");
	result = result.replaceAll("eːN", "ẽː");
	result = result.replaceAll("oːN", "õː");

	//ligatures "ʨ", "ʥ"
	result = result.replaceAll("ʨ", "t͡ɕ");
	result = result.replaceAll("ʥ", "d͡ʑ");

	return result;
}

function GetHangul(text) {
	let ipa = GetIPA(text, true);

	///ipa simplicize; diff. by lang.
	//long sound
	ipa = ipa.replaceAll("ː", "");

	//nasals
	ipa = ipa.replaceAll("ɐ̃", "ɐŋ");
	ipa = ipa.replaceAll("ɪ̃", "ɪŋ");
	ipa = ipa.replaceAll("ĩ", "iŋ");
	ipa = ipa.replaceAll("ʊ̃", "ʊŋ");
	ipa = ipa.replaceAll("ũ", "uŋ");
	ipa = ipa.replaceAll("ɑ̃", "aŋ");
	ipa = ipa.replaceAll("ẽ", "eŋ");
	ipa = ipa.replaceAll("õ", "oŋ");

	//vowel
	ipa = ipa.replaceAll("ɐ", "a");
	ipa = ipa.replaceAll("ɑ", "a");
	ipa = ipa.replaceAll("ɪ̯", "i");
	ipa = ipa.replaceAll("ɪ", "i");
	ipa = ipa.replaceAll("ʊ̯", "u");
	ipa = ipa.replaceAll("ʊ", "u");

	//consonant b c C ɕ d g h j K k l m n ɲ ŋ p P r s t T v z
	if (properties.preciseHangul) {
		ipa = ipa.replaceAll("r̩", "rɯ");
		ipa = ipa.replaceAll("l̩", "lɯ");

		ipa = ipa.replaceAll("kʰ", "K");
		ipa = ipa.replaceAll("ɡʱ", "g");
		ipa = ipa.replaceAll("t͡ɕʰ", "C");
		ipa = ipa.replaceAll("d͡ʑʱ", "z");
		ipa = ipa.replaceAll("ʈʰ", "T");
		ipa = ipa.replaceAll("ɖʱ", "d");
		ipa = ipa.replaceAll("tʰ", "T");
		ipa = ipa.replaceAll("dʱ", "d");
		ipa = ipa.replaceAll("pʰ", "P");
		ipa = ipa.replaceAll("bʱ", "b");
		ipa = ipa.replaceAll("ɡ", "g");
		ipa = ipa.replaceAll("ɦ", "h");
		ipa = ipa.replaceAll("t͡ɕ", "c");
		ipa = ipa.replaceAll("d͡ʑ", "z");
		ipa = ipa.replaceAll("l̃", "l");
		ipa = ipa.replaceAll("ʈ", "t");
		ipa = ipa.replaceAll("ɖ", "d");
		ipa = ipa.replaceAll("ɳ", "n");
		ipa = ipa.replaceAll("ɾ", "r");
		ipa = ipa.replaceAll("ʂ", "ɕ");
		ipa = ipa.replaceAll("ɭ", "l");
		ipa = ipa.replaceAll("ʋ", "v");

		ipa = ipa.replaceAll("ɲj", "ɲ");
		ipa = ipa.replaceAll("jj", "ij");
		ipa = ipa.replaceAll("iij", "ij");
	}
	else {
		ipa = ipa.replaceAll("r̩", "ri");
		ipa = ipa.replaceAll("l̩", "li");
		
		ipa = ipa.replaceAll("kʰ", "K");
		ipa = ipa.replaceAll("k", "K");
		ipa = ipa.replaceAll("ɡʱ", "g");
		ipa = ipa.replaceAll("t͡ɕʰ", "C");
		ipa = ipa.replaceAll("t͡ɕ", "C");
		ipa = ipa.replaceAll("d͡ʑʱ", "z");
		ipa = ipa.replaceAll("ʈʰ", "T");
		ipa = ipa.replaceAll("ʈ", "T");
		ipa = ipa.replaceAll("ɖʱ", "d");
		ipa = ipa.replaceAll("tʰ", "T");
		ipa = ipa.replaceAll("t", "T");
		ipa = ipa.replaceAll("dʱ", "d");
		ipa = ipa.replaceAll("pʰ", "P");
		ipa = ipa.replaceAll("p", "P");
		ipa = ipa.replaceAll("bʱ", "b");
		ipa = ipa.replaceAll("ɡ", "g");
		ipa = ipa.replaceAll("ɦ", "h");
		ipa = ipa.replaceAll("d͡ʑ", "z");
		ipa = ipa.replaceAll("l̃", "l");
		ipa = ipa.replaceAll("ɖ", "d");
		ipa = ipa.replaceAll("ɳ", "n");
		ipa = ipa.replaceAll("ɾ", "r");
		ipa = ipa.replaceAll("ʂ", "ɕ");
		ipa = ipa.replaceAll("ɭ", "l");
		ipa = ipa.replaceAll("ʋ", "v");

		ipa = ipa.replaceAll("sj", "ɕ");
		ipa = ipa.replaceAll("ɲj", "ɲ");
		ipa = ipa.replaceAll("jj", "ij");
		ipa = ipa.replaceAll("iij", "ij");
	}

	//categorize
	const Vow = ["a", "e", "i", "o", "u"];
	const Con = ["b", "c", "C", "ɕ", "d", "g", "h", "j", "K", "k", "l", "m", "n", "ɲ", "ŋ", "p", "P", "r", "s", "t", "T", "v", "z", "π", "τ", "κ"];
	const parse_criteria = /(a|e|i|o|u|ɯ|b|c|C|ɕ|d|g|h|j|K|k|l|m|n|ɲ|ŋ|p|P|r|s|t|T|v|z|π|τ|κ|\s)/i;
	let ipa_parse = ipa.split(parse_criteria); ipa_parse = ipa_parse.filter(element => element !== ""); ipa_parse = [" "].concat(ipa_parse); ipa_parse.push(" ");

	///epenthesis rules; diff. by lang

	//[l 제외한 자음] + j + <a, e, i, o, u> -> j 앞에 분절
	var CT = ["b", "c", "C", "ɕ", "d", "g", "h", "j", "K", "k", "m", "n", "ɲ", "ŋ", "p", "P", "r", "s", "t", "T", "v", "z"];

	for (var n = 1; n < ipa_parse.length - 2; n ++) { for (var i = 0; i < CT.length; i ++) {
		if (CT.includes(ipa_parse[n]) && ipa_parse[n + 1] == "j") {
			ipa_parse.splice(n + 1, 0, "ɯ");
		}
	}}

	//불파음; 모음 + 파열음 + 자음
	//if (properties.preciseHangul) {
		var VT = ["a", "e", "i", "o", "u", "ɯ"];
		var AT = ["b", "d", "g", "K", "k", "p", "P", "t", "T", "c"];
		var BT = ["b", "c", "C", "ɕ", "d", "g", "K", "k", "p", "P", "s", "t", "T", "z"];
		var NT = ["π", "τ", "κ", "κ", "κ", "π", "π", "τ", "τ", "τ"]

		for (var n = 1; n < ipa_parse.length - 2; n ++) { for (var i = 0; i < VT.length; i ++) { for (var j = 0; j < AT.length; j ++) { for (var k = 0; k < BT.length; k ++) {
			if (VT.includes(ipa_parse[n]) && AT.includes(ipa_parse[n + 1]) && (BT.includes(ipa_parse[n + 2]) || ipa_parse[n + 2] == " " || n == ipa_parse.length - 3)) {
			let x = AT.indexOf(ipa_parse[n + 1]); ipa_parse[n + 1] = NT[x];
			}
		}}}}
	//}

	//장애음 + 자음
	var AT = ["b", "c", "C", "ɕ", "d", "g", "h", "j", "K", "k", "p", "P", "r", "s", "t", "T", "v", "z"];
	var BT = ["b", "c", "C", "ɕ", "d", "g", "h", "j", "K", "k", "l", "m", "n", "ɲ", "ŋ", "p", "P", "r", "s", "t", "T", "v", "z"];

	for (var n = 1; n < ipa_parse.length - 1; n ++) { for (var i = 0; i < AT.length; i ++) { for (var j = 0; j < BT.length; j ++) {
		if (AT.includes(ipa_parse[n]) && BT.includes(ipa_parse[n + 1])) {
			ipa_parse.splice(n + 1, 0, "ɯ");
		}
	}}}

	//어말 장애음
	for (var n = 1; n < ipa_parse.length - 1; n ++) { for (var i = 0; i < AT.length; i ++) {
		if (AT.includes(ipa_parse[n]) && ipa_parse[n + 1] == " ") {
			ipa_parse.splice(n + 1, 0, "ɯ");
		}
	}}

	//<n m ŋ> + <n m ŋ>인데 앞이나 뒤 중 한 곳이라도 모음이 없으면 삽입음
	var ST = ["n", "m", "ŋ", "ɲ"];
	var VT = ["a", "e", "i", "o", "u", "ɯ"];

	for (var n = 1; n < ipa_parse.length - 2; n ++) { for (var i = 0; i < ST.length; i ++) { for (var j = 0; j < ST.length; j ++) {
		if (ST.includes(ipa_parse[n]) && ST.includes(ipa_parse[n + 1]) && (!VT.includes(ipa_parse[n - 1]) || !VT.includes(ipa_parse[n + 2]))) {
			ipa_parse.splice(n + 1, 0, "ɯ");
		}
	}}}

	//자음 + ŋ 사이에 삽입음
	var CT = ["b", "c", "C", "ɕ", "d", "g", "h", "j", "K", "k", "l", "m", "n", "ɲ", "ŋ", "p", "P", "r", "s", "t", "T", "v", "z"];

	for (var n = 0; n < ipa_parse.length - 1; n ++) { for (var i = 0; i < CT.length; i ++) {
		if (CT.includes(ipa_parse[n]) && ipa_parse[n + 1] == "ŋ") {
			ipa_parse.splice(n + 1, 0, "ɯ");
		}
	}}

	//ɲ 바로 뒤에 자음이 오면 n으로 변경
	for (var n = 0; n < ipa_parse.length - 1; n ++) { for (var i = 0; i < CT.length; i ++) {
		if (ipa_parse[n] == "ɲ" && CT.includes(ipa_parse[n + 1])) {
			ipa_parse[n] = "n";
		}
	}}

	//어두 L을 R로
	for (var n = 1; n < ipa_parse.length - 1; n ++) {
		if (ipa_parse[n - 1] == " " && ipa_parse[n] == "l") {
			ipa_parse[n] = "r";
		}
	}

	//어두 ŋ을 ɯŋ으로
	for (var n = 1; n < ipa_parse.length - 1; n ++) {
		if (ipa_parse[n - 1] == " " && ipa_parse[n] == "ŋ") {
			ipa_parse.splice(n, 0, "ɯ");
		}
	}

	//와를 바로
	if (!properties.preciseHangul) {
		for (var n = 0; n < ipa_parse.length; n ++) {
			if (ipa_parse[n] == "v") {
				ipa_parse[n] = "b";
			}
		}
	}

	///ipa hangulize
	let han = ipa_parse.join("");

	//과교정 제거
	han = han.replaceAll("nɯj", "nj");
	han = han.replaceAll("mɯj", "mj");
	han = han.replaceAll("ɲɯj", "nj");
	han = han.replaceAll(" nj", " nɯj");
	han = han.replaceAll(" mj", " mɯj");
	han = han.replaceAll(" ɲj", " ɲɯj");

	//vowel
	han = han.replaceAll("a", "ㅏ");
	han = han.replaceAll("e", "ㅔ");
	han = han.replaceAll("i", "ㅣ");
	han = han.replaceAll("o", "ㅗ");
	han = han.replaceAll("u", "ㅜ");
	han = han.replaceAll("ɯ", "ㅡ");

	//consonant
	han = han.replaceAll("b", "ㅂ");
	han = han.replaceAll("c", "ㅉ");
	han = han.replaceAll("C", "ㅊ");
	han = han.replaceAll("ɕ", "S");
	han = han.replaceAll("d", "ㄷ");
	han = han.replaceAll("g", "ㄱ");
	han = han.replaceAll("h", "ㅎ");
	han = han.replaceAll("j", "J");
	han = han.replaceAll("K", "ㅋ");
	han = han.replaceAll("k", "ㄲ");
	han = han.replaceAll("l", "L");
	han = han.replaceAll("m", "ㅁ");
	han = han.replaceAll("n", "ㄴ");
	han = han.replaceAll("ɲ", "N");
	han = han.replaceAll("ŋ", "ㅇ");
	han = han.replaceAll("p", "ㅃ");
	han = han.replaceAll("P", "ㅍ");
	han = han.replaceAll("r", "ㄹ");
	han = han.replaceAll("s", "ㅅ");
	han = han.replaceAll("t", "ㄸ");
	han = han.replaceAll("T", "ㅌ");
	han = han.replaceAll("v", "V");
	han = han.replaceAll("z", "ㅈ");

	//to array
	HAN = [];
	for (var i = 0; i < han.length; i ++) { HAN.push(han.charAt(i)); }

	//non-greedy onset + nucleus
	for (var i = 0; i < HAN.length - 1; i ++) {
		//find cons. or vow.
		let p = HAN[i]; let q = HAN[i + 1]; let a = ""; let b = "";

		//space found
		if ([" ", "κ", "τ", "π"].includes(p)) { continue; }
		
		//vowel found
		else if (VH.includes(p)) { a = "X"; b = p; }

		//cons. found
		else if (CH.includes(p)) {
			//cons. seq. or final
			if (CH.includes(q) || q == " ") { continue; }
			//cons + vow.
			else { a = p; b = HAN[i + 1]; }
		}

		//cons. not able to be onset
		if (p == "ㅇ") { continue; }

		//execute banjeol
		let s = HangulBanjeol(a, b);

		//alternate
		HAN[i] = s; if (a != "X") { HAN.splice(i + 1, 1) }
	}

	//coda
	for (var i = 0; i < HAN.length - 1; i ++) {
		//p_mark: /l/ to *ㄹ
		let p = HAN[i]; let q = HAN[i + 1]; let p_mark = 0;
		if (p.charAt(0) == "*") { p_mark = 1; }

		//check if p is a complete hangul syllable
		let puc = p.charCodeAt(p_mark);
		if (!(44032 <= puc && puc <= 55203)) { continue; }

		//check if q is one of coda-able
		if (!Coda.includes(q)) { continue; }

		switch (q) {
			case "ㄴ":
				HAN[i] = (p_mark == 1 ? "*" : "") + String.fromCharCode(puc + 4);
				HAN.splice(i + 1, 1);
				break;
	
			case "ㅁ":
				HAN[i] = (p_mark == 1 ? "*" : "") + String.fromCharCode(puc + 16);
				HAN.splice(i + 1, 1);
				break;
				
			case "ㅇ":
				HAN[i] = (p_mark == 1 ? "*" : "") + String.fromCharCode(puc + 21);
				HAN.splice(i + 1, 1);
				break;

			case "κ":
				HAN[i] = (p_mark == 1 ? "*" : "") + String.fromCharCode(puc + 1);
				HAN.splice(i + 1, 1);
				break;	

			case "τ":
				HAN[i] = (p_mark == 1 ? "*" : "") + String.fromCharCode(puc + 19);
				HAN.splice(i + 1, 1);
				break;

			case "π":
				HAN[i] = (p_mark == 1 ? "*" : "") + String.fromCharCode(puc + 17);
				HAN.splice(i + 1, 1);
				break;
	
			case "L":
				HAN[i] = (p_mark == 1 ? "*" : "") + String.fromCharCode(puc + 8);
				HAN[i + 1] = "ㄹ";
				break;
		}
	}

	//l-mark
	for (var i = 1; i < HAN.length; i ++) {
		let p = HAN[i - 1]; let q = HAN[i]; let puc = p.charCodeAt(0);

		//check if p is a codaless hangul syllable
		if (!SH.includes(p)) { continue; }

		//check if q is l-marked
		if (q.charAt(0) != "*") { continue; }

		HAN[i] = HAN[i].replace("*", "");
		HAN[i - 1] = String.fromCharCode(puc + 8);
	}

	//epenthesis as helm
	const Sol = ["ㄴ", "ㄹ", "ㅁ", "ㅇ"];
	const Aft = ["는", "늘", "늠", "능", "른", "를", "름", "릉", "믄", "믈", "믐", "믕", "븩", "븬", "븯", "븰"];

	for (var i = 0; i < HAN.length - 1; i ++) {
		let p = HAN[i]; let q = HAN[i + 1];

		if (!Sol.includes(p) || !Sol.includes(q)) { continue; }

		let pi = Sol.indexOf(p); let qi = Sol.indexOf(q); let s = pi * Sol.length + qi;

		HAN[i] = Aft[s]; HAN.splice(i + 1, 1);
	}

	//delete non-syllables
	for (var i = 0; i < HAN.length; i ++) {
		let p = HAN[i];

		if (p != " " && !(44032 <= p.charCodeAt(0) && p.charCodeAt(0) <= 55203)) {
			HAN.splice(i, 1);
		}
	}

	///return
	return HAN.join("").trim();
}

function HangulBanjeol(onset, nucleus) {
	let a = CH.indexOf(onset); let b = VH.indexOf(nucleus);
	if (a == -1) { return "뵥"; } if (b == -1) { return "뱝"; }

	let num = b * CH.length + a;
	return SH[num];
}

function showPronounce(arg0, arg1) {
	if (arg0 == "") { return ""; }

	if (properties.showHangulInsteadOfIPA) {
		return GetHangul(arg0, arg1);
	}
	else {
		return GetIPA(arg0, arg1);
	}
}



function LattoDev(text) {
	if (text == "") { return ""; }

	//첫 글자가 모음이면 대문자로 올리기
	let Vow = ["a", "e", "i", "o", "u", "ā", "ī", "ū", "ṛ", "ṝ", "ḷ", "ḹ"];

	if (Vow.includes(text.charAt(0))) {
		text = text.charAt(0).toUpperCase() + text.slice(1);
	}

	for (var i = 0; i < Vow.length; i ++) {
		text = text.replaceAll(" " + Vow[i], " " + Vow[i].toUpperCase());
		text = text.replaceAll("’" + Vow[i], "’" + Vow[i].toUpperCase());
	}

	//마지막 글자가 자음이면 위라마 추가
	let Con = ["b", "c", "d", "ḍ", "g", "h", "j", "k", "l", "ḻ", "m", "n", "ṅ", "ñ", "ṇ", "p", "r", "s", "ś", "ṣ", "t", "ṭ", "v", "y"];

	if (Con.includes(text.charAt(text.length - 1))) {
		text += "V";
	}

	for (var i = 0; i < Vow.length; i ++) {
		text = text.replaceAll(Con[i] + " ", Con[i] + " " + "V");
	}

	//자음연쇄 사이에 위라마 추가
	Con = ["k", "kh", "g", "gh", "ṅ", "h", "c", "ch", "j", "jh", "ñ", "y", "ś", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "r", "ṣ", "ḻ", "t", "th", "d", "dh", "n", "l", "s", "p", "ph", "b", "bh", "m", "v"];

	for (var i = 0; i < Con.length; i ++) { for (var j = 0; j < Con.length; j ++) { 
		if (Con[j] == "h") { continue; }
		text = text.replaceAll(Con[i] + Con[j], Con[i] + "V" + Con[j]);
	}}


	let IAST = [" ", "V", "łl", "ai", "Ai", "au", "Au", "bh", "ch", "dh", "ḍh", "gh", "jh", "kh", "ph", "th", "ṭh", "’", "a", "A", "ā", "Ā", "b", "c", "d", "ḍ", "e", "E", "g", "h", "ḥ", "i", "I", "ī", "Ī", "j", "k", "l", "ḷ", "Ḷ", "ḻ", "ḹ", "Ḹ", "m", "ṃ", "n", "ṅ", "ñ", "ṇ", "o", "O", "p", "r", "ṛ", "Ṛ", "ṝ", "Ṝ", "s", "ś", "ṣ", "t", "ṭ", "u", "U", "ū", "Ū", "v", "y"];
	let DEVA = [" ", "्", "लँल", "ै", "ऐ", "ौ", "औ", "भ", "छ", "ध", "ढ", "घ", "झ", "ख", "फ", "थ", "ठ", "ऽ", "", "अ", "ा", "आ", "ब", "च", "द", "ड", "े", "ए", "ग", "ह", "ः", "ि", "इ", "ी", "ई", "ज", "क", "ल", "ॢ", "ऌ", "ळ", "ॣ", "ॡ", "म", "ं", "न", "ङ", "ञ", "ण", "ो", "ओ", "प", "र", "ृ", "ऋ", "ॄ", "ॠ", "स", "श", "ष", "त", "ट", "ु", "उ", "ू", "ऊ", "व", "य"];
	let IAST_regex = /(V|łl|ai|Ai|au|Au|bh|ch|dh|ḍh|gh|jh|kh|ph|th|ṭh|’|a|A|ā|Ā|b|c|d|ḍ|e|E|g|h|ḥ|i|I|ī|Ī|j|k|l|ḷ|Ḷ|ḻ|ḹ|Ḹ|m|ṃ|n|ṅ|ñ|ṇ|o|O|p|r|ṛ|Ṛ|ṝ|Ṝ|s|ś|ṣ|t|ṭ|u|U|ū|Ū|v|y|\s)/i;

	//parse
	let text_parse = text.split(IAST_regex);
	text_parse = text_parse.filter(element => element !== "");

	//change
	let result = "";
	for (var i = 0; i < text_parse.length; i ++) {
		result += DEVA[IAST.indexOf(text_parse[i])];
	}

	return result;
}