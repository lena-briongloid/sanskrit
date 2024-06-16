  function GetIPA(str, hideSyllableMark) {
    str = str.toLowerCase();
    str = str.replace(/ṁ/g, "ṃ");

    if (str == "" || str == "-") { return ""; }

    /*
    //마지막 요소 종성법칙 적용
    var str_array = str.split(/\s/);
    str_array[str_array.length - 1] = Reduct(str_array[str_array.length - 1]);
    str = str_array.join(" ");
    */

    var Element = [" ", "|", "łl", "ai", "au", "kh", "gh", "ch", "jh", "ṭh", "ḍh", "th", "dh", "ph", "bh", "a", "ā", "i", "ī", "u", "ū", "ṛ", "ṝ", "ḷ", "ḹ", "e", "o", "ṃ", "ḥ", "'", "’", "k", "g", "ṅ", "h", "c", "j", "ñ", "y", "ś", "ṭ", "ḍ", "ṇ", "r", "ṣ", "ḻ", "t", "d", "n", "l", "s", "p", "b", "m", "ł", "v"];
    var Sound = [" ", ".", "l̃", "aːi", "aːu", "kʰ", "ɡʱ", "ʨʰ", "ʥʱ", "ʈʰ", "ɖʱ", "tʰ", "dʱ", "pʰ", "bʱ", "a", "aː", "ɪ", "iː", "ʊ", "uː", "r̩", "r̩ː", "l̩", "l̩ː", "eː", "oː", "N", "h", "", "", "k", "ɡ", "ŋ", "ɦ", "ʨ", "ʥ", "ɲ", "j", "ɕ", "ʈ", "ɖ", "ɳ", "ɾ", "ʂ", "ɭ", "t", "d", "n", "l", "s", "p", "b", "m", "N", "ʋ"];

    var parse_criteria = /(łl|ai|au|kh|gh|ch|jh|ṭh|ḍh|th|dh|ph|bh|a|ā|i|ī|u|ū|ṛ|ṝ|ḷ|ḹ|e|o|ṃ|ḥ|\'|k|g|ṅ|h|c|j|ñ|y|ś|ṭ|ḍ|ṇ|r|ṣ|ḻ|t|d|n|l|s|p|b|m|ł|v)/i;

    var str_parse = str.split(parse_criteria);
    while (str_parse.includes("")) {
      var index = str_parse.indexOf("");
      str_parse.splice(index, 1);
    }

    //음절별로 쪼개기
    var Vowel = ["a", "ā", "i", "ī", "u", "ū", "ṛ", "ṝ", "ḷ", "ḹ", "e", "ai", "o", "au"];
    var Ender = ["k", "kh", "g", "gh", "ṅ", "c", "ch", "j", "jh", "ñ", "ṭ", "ṭh", "ḍ", "ḍh", "ṇ", "t", "th", "d", "dh", "n", "p", "ph", "b", "bh", "m"];
    var Consn = ["h", "r", "l", "v", "ś", "ṣ", "s", "ḻ"];

    var took_vowel = false;
    var k = -1;

    while (k < str_parse.length) {
      k ++;
      if ([" ", "|"].includes(str_parse[k])) {
        took_vowel = false; continue;
      }
      else if (k == str_parse.length - 1) {
        break;
      }

      if (Vowel.includes(str_parse[k])) {
        took_vowel = true; continue;
      }

      if (took_vowel == true) {
        if (Vowel.includes(str_parse[k])) {
          str_parse.splice(k, 0, "|");
          took_vowel = false;
        }
        else if (["ṃ", "ḥ"].includes(str_parse[k])) {
          str_parse.splice(k + 1, 0, "|");
          took_vowel = false;
        }
        else if (Ender.includes(str_parse[k])) {
          //받아줄 모음 있음
          if (k + 1 < str_parse.length && Vowel.includes(str_parse[k + 1])) {
            str_parse.splice(k, 0, "|");
          }
          //받아줄 모음 없음
          else {
            str_parse.splice(k + 1, 0, "|");
          }

          took_vowel = false;
        }
        else {
          //받아줄 모음 있음
          if (k + 1 < str_parse.length && Vowel.includes(str_parse[k + 1])) {
            str_parse.splice(k, 0, "|");
            took_vowel = false;
          }
        }
      }
    }

    //C + y 위치 재조정
    //자+자+끊+y >> 자+끊+자+y
    for (var i = 0; i <= str_parse.length - 4; i ++) {
      if(Ender.concat(Consn).includes(str_parse[i]) && Ender.concat(Consn).includes(str_parse[i + 1]) && str_parse[i + 2] == "|" && str_parse[i + 3] == "y") {
        str_parse[i + 2] = str_parse[i + 1];
        str_parse[i + 1] = "|";
      }
    }

    //IPA 추출
    var IPA = "";

    for (var i = 0; i < str_parse.length; i ++) {
      IPA = IPA + Sound[Element.indexOf(str_parse[i])];
    }

    //비음
    IPA = IPA.replace(/(aN)/g, "ã");
    IPA = IPA.replace(/(ɪN)/g, "ĩ");
    IPA = IPA.replace(/(ʊN)/g, "ũ");
    IPA = IPA.replace(/(aN)/g, "ã");
    IPA = IPA.replace(/(iN)/g, "ĩ");
    IPA = IPA.replace(/(uN)/g, "ũ");
    IPA = IPA.replace(/(eN)/g, "ẽ");
    IPA = IPA.replace(/(oN)/g, "õ");
    IPA = IPA.replace(/(aːN)/g, "ãː");
    IPA = IPA.replace(/(iːN)/g, "ĩː");
    IPA = IPA.replace(/(uːN)/g, "ũː");
    IPA = IPA.replace(/(eːN)/g, "ẽː");
    IPA = IPA.replace(/(oːN)/g, "õː");

    IPA = IPA.replace(/(ʨ\.)/g, "t.");

    IPA = IPA.replace(/(\. )/g, " ");

    return IPA;
  }

  function GetHangul(text, dummy) {
    if (text == "" || text == "-") { return ""; }

  	var ipa = GetIPA(text);

    //장음 삭제
    ipa = ipa.replace(/ː/g, "");

    //모음 대체
    ipa = ipa.replace(/ɐ/g, "a");
    ipa = ipa.replace(/ɪ/g, "i");
    ipa = ipa.replace(/ʊ/g, "u");
    ipa = ipa.replace(/r̩/g, "ri");
    ipa = ipa.replace(/l̩/g, "li");

    //비모음 대체
    ipa = ipa.replace(/ã/g, "aŋ");
    ipa = ipa.replace(/ĩ/g, "iŋ");
    ipa = ipa.replace(/ũ/g, "uŋ");
    ipa = ipa.replace(/ẽ/g, "eŋ");
    ipa = ipa.replace(/õ/g, "oŋ");

    //반모음 대체
    ipa = ipa.replace(/(ji)/g, "i");

    //자음 대체
    ipa = ipa.replace(/ɲa/g, "Na");
    ipa = ipa.replace(/ɲi/g, "ni");
    ipa = ipa.replace(/ɲu/g, "Nu");
    ipa = ipa.replace(/ɲe/g, "Ne");
    ipa = ipa.replace(/ɲo/g, "No");
    ipa = ipa.replace(/ɲ/g, "n");

    ipa = ipa.replace(/ʱ/g, "");
    ipa = ipa.replace(/kʰ/g, "K");
    ipa = ipa.replace(/ɦ/g, "h");
    ipa = ipa.replace(/ɡ/g, "g");
    ipa = ipa.replace(/ʨʰ/g, "C");
    ipa = ipa.replace(/ʨ/g, "c");
    ipa = ipa.replace(/ɕ/g, "S");
    ipa = ipa.replace(/ʈʰ/g, "T");
    ipa = ipa.replace(/ʈ/g, "t");
    ipa = ipa.replace(/ɖ/g, "d");
    ipa = ipa.replace(/ɳ/g, "n");
    ipa = ipa.replace(/ɾ/g, "r");
    ipa = ipa.replace(/ʂ/g, "S");
    ipa = ipa.replace(/ɭ/g, "l");
    ipa = ipa.replace(/l̃/g, "l");
    ipa = ipa.replace(/tʰ/g, "T");
    ipa = ipa.replace(/pʰ/g, "P");   
    ipa = ipa.replace(/ʋ/g, "v");

    //자음 목록: k K g ŋ c C ʥ t T d n N p P b m j r l v s S h
    //모음 목록: a i u e o

    //모음 분리
    var Vow = ["a", "e", "i", "o", "u"]; var VowExt = ["a", "e", "i", "o", "u", "la", "le", "li", "lo", "lu", "ra", "re", "ri", "ro", "ru"]
    for (var i = 0; i < Vow.length; i ++) {for (var j = 0; j < VowExt.length; j ++) {
      ipa = ipa.replaceAll(Vow[i] + VowExt[j], Vow[i] + "." + VowExt[j]);
    }}

    //자음 + r/n/m/ŋ/l 사이에 . 넣기
    var Con = ["k", "K", "g", "ŋ", "c", "C", "ʥ", "t", "T", "d", "n", "p", "P", "b", "m", "j", "r", "l", "v", "s", "S", "h"];
    var Liq = ["r", "n", "N", "m", "ŋ", "l"];

    for (var i = 0; i < Con.length; i ++) {for (var j = 0; j < Liq.length; j ++) {
      ipa = ipa.replaceAll(Con[i] + Liq[j], Con[i] + "." + Liq[j]);
    }}

    //(모음) + (유음 제외한 자음) + . + (모음 또는 (n m r l + 모음)) >> 모음 + . + 유음 제외한 자음 + . + + 모음 또는 n m r l
    var Vow = ["a", "e", "i", "o", "u"];
    var Con = ["k", "K", "g", "c", "C", "ʥ", "t", "T", "d", "p", "P", "b", "j", "r", "v", "s", "S", "h"];
    var Liq = ["j", "a", "e", "i", "o", "u", "na", "Na", "ma", "ra", "la", "va", "ne", "Ne", "me", "re", "le", "ve", "ni", "Ni", "mi", "ri", "li", "vi", "no", "No", "mo", "ro", "lo", "vo", "nu", "Nu", "mu", "ru", "lu", "vu"];

    for (var i = 0; i < Vow.length; i ++) {for (var j = 0; j < Con.length; j ++) {for (var k = 0; k < Liq.length; k ++) {
      ipa = ipa.replaceAll(Vow[i] + Con[j] + "." + Liq[k], Vow[i] + "." + Con[j] + "." + Liq[k]);
    }}}

    //자음 + j >> . + 자음 + . + j
    var Con = ["k", "K", "g", "ŋ", "c", "C", "ʥ", "t", "T", "d", "n", "N", "p", "P", "b", "m", "j", "r", "l", "v", "s", "S", "h"];

    for (var i = 0; i < Con.length; i ++) {
      ipa = ipa.replaceAll(Con[i] + "j", "." + Con[i] + ".j");
    }

    //유음 제외한 자모음 + "." + l > l 복제
    var Con = ["a", "i", "u", "e", "o", "k", "K", "g", "c", "C", "ʥ", "t", "T", "d", "p", "P", "b", "j", "r", "v", "s", "S", "h"];

    for (var i = 0; i < Con.length; i ++) {
      ipa = ipa.replaceAll(Con[i] + ".l", Con[i] + "l.l");
    }

    //모음 + r s S h 분리, a.ŋ >> aŋ., ŋa >> ŋ.a
    var Vow = ["a", "e", "i", "o", "u"];

    for (var i = 0; i < Vow.length; i ++) {
      ipa = ipa.replaceAll(Vow[i] + "r", Vow[i] + ".r");
      ipa = ipa.replaceAll(Vow[i] + "s", Vow[i] + ".s");
      ipa = ipa.replaceAll(Vow[i] + "S", Vow[i] + ".S");
      ipa = ipa.replaceAll(Vow[i] + "h", Vow[i] + ".h");
      ipa = ipa.replaceAll(Vow[i] + ".ŋ", Vow[i] + "ŋ.");
      ipa = ipa.replaceAll("ŋ" + Vow[i], "ŋ." + Vow[i]);
    }

    //음절 끝소리 무성음화
    for (var i = 0; i < Vow.length; i ++) {
      ipa = ipa.replaceAll(Vow[i] + "K.", Vow[i] + "k.");
      ipa = ipa.replaceAll(Vow[i] + "g.", Vow[i] + "k.");
      ipa = ipa.replaceAll(Vow[i] + "C.", Vow[i] + "t.");
      ipa = ipa.replaceAll(Vow[i] + "ʥ.", Vow[i] + "t.");
      ipa = ipa.replaceAll(Vow[i] + "T.", Vow[i] + "t.");
      ipa = ipa.replaceAll(Vow[i] + "d.", Vow[i] + "t.");
      ipa = ipa.replaceAll(Vow[i] + "P.", Vow[i] + "p.");
      ipa = ipa.replaceAll(Vow[i] + "b.", Vow[i] + "p.");
    }

    //일부 자음군 특수 처리
    ipa = ipa.replaceAll("kS", "k.S");
    ipa = ipa.replaceAll("Sc", "S.c");
    ipa = ipa.replaceAll("rt.t", "r.t");

    //자음 + v 분리
    var Con = ["k", "K", "g", "ŋ", "c", "C", "ʥ", "t", "T", "d", "n", "p", "P", "b", "m", "j", "r", "l", "v", "s", "S", "h"];
    for (var i = 0; i < Con.length; i ++) {
      ipa = ipa.replaceAll(Con[i] + "v", Con[i] + ".v");
    }

    //모음 + 자음 아직도 분리 안 됐다면 분리하기 (ab > a.b)
    var Vow = ["a", "e", "i", "o", "u"];
    var Con = ["K", "g", "c", "C", "ʥ", "T", "d", "P", "b", "v", "s", "S", "h"];

    for (var i = 0; i < Vow.length; i ++) {for (var j = 0; j < Con.length; j ++) {
      ipa = ipa.replaceAll(Vow[i] + Con[j], Vow[i] + "." + Con[j]);
    }}

    ipa = ipa.replaceAll("..", ".");
    ipa = ipa.replaceAll(" .", ".");
    ipa = ipa.replaceAll(". ", ".");
    ipa = ipa.replace(/^\./g, "");
    ipa = ipa.replace(/\.$/g, "");

    //나뉜 음절을 한글로 변환하기
    var hangul = "";
    var ipa_parse = ipa.split(".");

    const HanBef = [" ", "k", "K", "g", "ŋ", "c", "C", "ʥ", "t", "T", "d", "n", "N", "p", "P", "b", "m", "j", "r", "l", "v", "s", "S", "h", "a", "ka", "Ka", "ga", "ŋa", "ca", "Ca", "ʥa", "ta", "Ta", "da", "na", "Na", "pa", "Pa", "ba", "ma", "ja", "ra", "la", "va", "sa", "Sa", "ha", "i", "ki", "Ki", "gi", "ŋi", "ci", "Ci", "ʥi", "ti", "Ti", "di", "ni", "Ni", "pi", "Pi", "bi", "mi", "ji", "ri", "li", "vi", "si", "Si", "hi", "u", "ku", "Ku", "gu", "ŋu", "cu", "Cu", "ʥu", "tu", "Tu", "du", "nu", "Nu", "pu", "Pu", "bu", "mu", "ju", "ru", "lu", "vu", "su", "Su", "hu", "e", "ke", "Ke", "ge", "ŋe", "ce", "Ce", "ʥe", "te", "Te", "de", "ne", "Ne", "pe", "Pe", "be", "me", "je", "re", "le", "ve", "se", "Se", "he", "o", "ko", "Ko", "go", "ŋo", "co", "Co", "ʥo", "to", "To", "do", "no", "No", "po", "Po", "bo", "mo", "jo", "ro", "lo", "vo", "so", "So", "ho"];
    const HanAft = [" ", "끄", "크", "그", "응", "쯔", "츠", "즈", "뜨", "트", "드", "느", "느", "쁘", "프", "브", "므", "이", "르", "르", "브", "스", "쉬", "흐", "아", "까", "카", "가", "뀨", "짜", "차", "자", "따", "타", "다", "나", "냐", "빠", "파", "바", "마", "야", "라", "라", "와", "사", "샤", "하", "이", "끼", "키", "기", "뀨", "찌", "치", "지", "띠", "티", "디", "니", "니", "삐", "피", "비", "미", "이", "리", "리", "위", "시", "시", "히", "우", "꾸", "쿠", "구", "뀨", "쭈", "추", "주", "뚜", "투", "두", "누", "뉴", "뿌", "푸", "부", "무", "유", "루", "루", "부", "수", "슈", "후", "에", "께", "케", "게", "뀨", "쩨", "체", "제", "떼", "테", "데", "네", "녜", "뻬", "페", "베", "메", "예", "레", "레", "웨", "세", "셰", "헤", "오", "꼬", "코", "고", "뀨", "쪼", "초", "조", "또", "토", "도", "노", "뇨", "뽀", "포", "보", "모", "요", "로", "로", "워", "소", "쇼", "호"];

    //띄어쓰기
    for (var i = 0; i < ipa_parse.length; i ++) {
      if (ipa_parse[i].includes(" ") && ipa_parse[i] != " ") {
        var split = ipa_parse[i].split(" ");
        ipa_parse.splice(i, 1, split[0], " ", split[1]);
      }
    }

    for (var i = 0; i < ipa_parse.length; i ++) {
      var syllable = ipa_parse[i];
      var syl_final = "";
      var space = false;

      if (syllable.length > 1 && !(syllable.endsWith("a") || syllable.endsWith("i") || syllable.endsWith("u") || syllable.endsWith("e") || syllable.endsWith("o"))) {
        syl_final = syllable.charAt(syllable.length - 1);
        syllable = syllable.slice(0, syllable.length - 1);
      }

      var syl_han = HanAft[HanBef.indexOf(syllable)];

      if (syl_final == "k") {
        syl_han = String.fromCharCode(syl_han.charCodeAt(0) + 1);
      }
      else if (syl_final == "n") {
        syl_han = String.fromCharCode(syl_han.charCodeAt(0) + 4);
      }
      else if (syl_final == "l") {
        syl_han = String.fromCharCode(syl_han.charCodeAt(0) + 8);
      }
      else if (syl_final == "m") {
        syl_han = String.fromCharCode(syl_han.charCodeAt(0) + 16);
      }
      else if (syl_final == "p") {
        syl_han = String.fromCharCode(syl_han.charCodeAt(0) + 17);
      }
      else if (syl_final == "t") {
        syl_han = String.fromCharCode(syl_han.charCodeAt(0) + 19);
      }
      else if (syl_final == "ŋ") {
        syl_han = String.fromCharCode(syl_han.charCodeAt(0) + 21);
      }

      hangul = hangul + syl_han;
    }

    return hangul;
  }

  function anyof(check, array) {
    for (var i = 0; i < array.length; i ++) {
      if (check == array[i]) {
        return true;
      }
    }

    return false;
  }


function showPronounce(arg0, arg1) {
	if (properties.showHangulInsteadOfIPA) {
		return GetHangul(arg0, arg1);
	}
	else {
		return GetIPA(arg0, arg1);
	}
}