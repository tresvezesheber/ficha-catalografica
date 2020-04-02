function generatePDF() {
    var doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });
    doc.setFont('times')
    doc.setFontSize(10)

    // Pegando valores dos elementos
    var e_nome_autor = document.querySelector("#nome_autor").value;
    var s_titulo = document.querySelector('#titulo').value
    var s_subtitulo = document.querySelector('#subtitulo').value
    var s_instituicao = document.querySelector('#instituicao').value
    var s_local = document.querySelector('#local').value
    var s_ano = document.querySelector('#ano').value
    var s_paginas_pretextual = document.querySelector('#paginas_pretextual').value
    var s_paginas_total = document.querySelector('#paginas_total').value
    var s_ilustracao = document.querySelector('#ilustracao').value
    var s_bibliografia = document.querySelector('#bibliografia').value
    var s_material_anexo = document.querySelector('#material_anexo').value
    var s_titulacao = document.querySelector('#titulacao').value
    var s_curso = document.querySelector('#curso').value
    var e_orientador = document.querySelector('#orientador').value
    var e_coorientador = document.querySelector('#coorientador').value
    var e_palavras_chave = document.querySelector("#palavras_chave").value;
    var phrase_elaboratedBy = "Ficha catalográfica elaborada pela Biblioteca Central da Universidade de Vassouras / Vassouras - RJ";

    var phrase_title_subtitle = "";
    var phrase_inclui = "";
    var phrase_pagination = "";
    var phrase_keywords = ""
    var phrase_pos_keywords = ""
    var phrase_advisors = ""
    var phrase_degree = ""

    var date = new Date()
    var ano = date.getFullYear()

    // Tratamentos
    var s_autor = splitName(e_nome_autor);
    var s_orientador = splitName(e_orientador);
    var s_coorientador = splitName(e_coorientador);


    phrase_title_subtitle = generateTitleSubtitlePhrase(s_titulo, s_subtitulo)
    phrase_pagination = generatePaginationPhrase(s_paginas_pretextual, s_paginas_total, s_ilustracao)
    phrase_inclui = generateMaterialsPhrase(s_ilustracao, s_bibliografia, s_material_anexo)
    phrase_keywords = generateKeyWordsPhrase(e_palavras_chave)
    phrase_pos_keywords = generatePosKeyWordsPhrase(s_orientador, s_coorientador, s_instituicao, s_titulo)
    phrase_advisors = generateAdvisorsPhrase(e_orientador, e_coorientador)
    phrase_degree = generateDegreePhrase(s_titulacao, s_curso)

    var line_1 = `${s_autor[0]}, ${s_autor[1]}\n`
    var line_2 = `      ${phrase_title_subtitle} / ${e_nome_autor}. - ${s_local}: ${s_ano}.\n`;
    var line_3 = `      ${phrase_pagination}\n\n`;
    var line_4 = '      ' + phrase_advisors + '\n';
    var line_5 = `      ${phrase_degree} - Universidade de Vassouras, ${s_ano}.\n`;
    var line_6 = '      ' + phrase_inclui + '\n\n';
    var line_7 = `      ${phrase_keywords}  ${phrase_pos_keywords}`;

    var text = doc.splitTextToSize(line_1 + line_2 + line_3 + line_4 + line_5 + line_6 + line_7, 110);


    // Desenhando retângulo e linhas
    doc.rect(50, 185, 129, 72)
    doc.setLineWidth(1);
    doc.line(52, 262, 179, 262);
    doc.line(178.6, 257, 178.6, 262.5);

    // Escrevendo conteudo no PDF
    doc.text(text, 64, 192)
    doc.setFontSize(8).text(phrase_elaboratedBy, 56, 260);

    // Salva automaticamente
    // doc.save(`Ficha Catalográfica - ${e_nome_autor}.pdf`, {returnPromise:true}).then(successGeneratePDF());

    // Apenas abre em uma nova aba
    doc.output('dataurlnewwindow');
}

function successGeneratePDF() {
    var form = document.querySelector('#form')
    var success_msg = document.querySelector('.success-msg')

    form.remove()
    success_msg.classList.remove('success-msg')
}

function splitName(name) {
    var name_splited = [];

    name_splited.push(name.split(' ').slice(-1).join(' '));
    name_splited.push(name.split(' ').slice(0, -1).join(' '));

    return name_splited;
}

function generateTitleSubtitlePhrase(title, subtitle) {
    var phrase_title_subtitle = "";
    if (subtitle) {
        phrase_title_subtitle = `${title}: ${subtitle}`;
    } else {
        phrase_title_subtitle = `${title}`;
    }

    return phrase_title_subtitle;
}

function generatePaginationPhrase(paginas_pretextual, paginas_total, ilustracao) {
    var phrase_pagination = "";

    if (ilustracao === 'true') {
        phrase_pagination = `${generateRomanNumeral(paginas_pretextual)}, ${paginas_total} f. : il. ; 29,7 cm.`;
    } else {
        phrase_pagination = `${generateRomanNumeral(paginas_pretextual)}, ${paginas_total} f. ; 29,7 cm.`;
    }

    return phrase_pagination;
}

// Função adaptada do site http://www.interaula.com/matweb/conline/progs/romanos.htm
function generateRomanNumeral(numero) {
    var N = numero;
    // var N1 = N;
    var Y = ""
    while (N / 1000 >= 1) { Y += "m"; N = N - 1000; }
    if (N / 900 >= 1) { Y += "cm"; N = N - 900; }
    if (N / 500 >= 1) { Y += "d"; N = N - 500; }
    if (N / 400 >= 1) { Y += "cd"; N = N - 400; }
    while (N / 100 >= 1) { Y += "c"; N = N - 100; }
    if (N / 90 >= 1) { Y += "xc"; N = N - 90; }
    if (N / 50 >= 1) { Y += "l"; N = N - 50; }
    if (N / 40 >= 1) { Y += "xl"; N = N - 40; }
    while (N / 10 >= 1) { Y += "x"; N = N - 10; }
    if (N / 9 >= 1) { Y += "ix"; N = N - 9; }
    if (N / 5 >= 1) { Y += "v"; N = N - 5; }
    if (N / 4 >= 1) { Y += "iv"; N = N - 4; }
    while (N >= 1) { Y += "i"; N = N - 1; }
    return Y;
}

function generateDegreePhrase(titulacao, curso) {
    var phrase_degree = ";"
    if (titulacao === "Mestre") {
        phrase_degree = `Dissertação para Obtenção do Grau de ${titulacao} em ${curso}`;
    } else if (titulacao === "Doutor" || titulacao === "Livre Docente") {
        phrase_degree = `Tese para Obtenção do Grau de ${titulacao} em ${curso}`;
    } else {
        phrase_degree = `Trabalho de Conclusão de Curso para Obtenção do Grau de ${titulacao} em ${curso}`;
    }

    return phrase_degree;
}

function generateMaterialsPhrase(ilustracao, bibliografia, anexo) {
    var values_material = [(ilustracao == "true") ? "Ilustrações" : " ", (bibliografia == "true") ? "Bibliografias" : " ", (anexo == "true" ? "Material Anexo" : " ")]

    var valor_corte = " "
    var indice = values_material.indexOf(valor_corte)

    while (indice >= 0) {
        values_material.splice(indice, 1);
        indice = values_material.indexOf(valor_corte);
    }

    if (values_material.length === 1) {
        phrase_inclui = `Inclui ${values_material[0]}.`
    } else if (values_material.length === 2) {
        phrase_inclui = `Inclui ${values_material[0]} e ${values_material[1]}.`
    } else {
        phrase_inclui = 'Inclui ' + values_material.slice(0, -1).join(', ') + ' e ' + values_material.slice(-1) + '.'
    }

    return phrase_inclui;
}

function generateKeyWordsPhrase(palavras_chave) {
    var s_palavras_chave = palavras_chave.split(",").map(function (palavra) {
        return palavra.trim();
    });

    if (s_palavras_chave.length == 3) {
        phrase_keywords = `1. ${s_palavras_chave[0]}. 2. ${s_palavras_chave[1]}. 3. ${s_palavras_chave[2]}.`;
    } else if (s_palavras_chave.length == 4) {
        phrase_keywords = `1. ${s_palavras_chave[0]}. 2. ${s_palavras_chave[1]}. 3. ${s_palavras_chave[2]}. 4. ${s_palavras_chave[3]}.`;
    } else {
        phrase_keywords = `1. ${s_palavras_chave[0]}. 2. ${s_palavras_chave[1]}. 3. ${s_palavras_chave[2]}. 4. ${s_palavras_chave[3]}. 5. ${s_palavras_chave[4]}.`;
    }

    return phrase_keywords;
}

function generatePosKeyWordsPhrase(orientador, coorientador, instituicao, titulo) {
    if (coorientador[0] === "" && coorientador[1] === "") {
        phrase_pos_keywords = `I. ${orientador[0]}, ${orientador[1]}. II. ${instituicao}. III. ${titulo}.`
    } else {
        phrase_pos_keywords = `I. ${orientador[0]}, ${orientador[1]}. II. ${coorientador[0]}, ${coorientador[1]}. III. ${instituicao}. IV. ${titulo}.`
    }

    return phrase_pos_keywords;
}

function generateAdvisorsPhrase(orientador, coorientador) {
    var phrase_advisors = `Orientador: ${orientador}.`;

    if (coorientador != '') {
        phrase_advisors = phrase_advisors + ` Coorientador: ${coorientador}`;
    }

    return phrase_advisors;
}