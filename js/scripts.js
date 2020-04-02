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

    var phrase_inclui = "";
    var phrase_keywords = ""
    var phrase_pos_keywords = ""
    var phrase_advisors = ""

    var date = new Date()
    var ano = date.getFullYear()

    // Tratamentos
    var s_autor = splitName(e_nome_autor);
    var s_orientador = splitName(e_orientador);
    var s_coorientador = splitName(e_coorientador);

    phrase_inclui = generateMaterialsPhrase(s_ilustracao, s_bibliografia, s_material_anexo)
    phrase_keywords = generateKeyWordsPhrase(e_palavras_chave)
    phrase_pos_keywords = generatePosKeyWordsPhrase(s_orientador, s_coorientador, s_instituicao, s_titulo)
    phrase_advisors = generateAdvisorsPhrase(e_orientador, e_coorientador)

    // Escrevendo conteudo no PDF
    doc.rect(50, 185, 129, 62)
    doc.text(`${s_autor[0]}, ${s_autor[1]}`, 64, 192)
    doc.text(`${s_titulo} / ${e_nome_autor}. - ${s_local}: ${s_ano}.`, 70, 196, { maxWidth: '106' })
    doc.text(`xiii, ${s_paginas_total} f. : il. ; 29,7 cm.`, 70, 204)
    doc.text(phrase_advisors, 70, 216, { maxWidth: '106' })
    doc.text(`Trabalho de Conclusão de Curso para Obtenção do Grau de ${s_titulacao} em ${s_curso} - Universidade de Vassouras, ${s_ano}.`, 70, 70, { maxWidth: '100' })

    doc.text(phrase_inclui, 5, 55)
    doc.text(`Trabalho de Conclusão de Curso para Obtenção do Grau de ${s_titulacao} em ${s_curso} - Universidade de Vassouras, ${s_ano}.`, 5, 70)
    doc.text(`${phrase_keywords}  ${phrase_pos_keywords}`, 5, 75, { maxWidth: '100' })
    doc.setFontSize(9).text(phrase_elaboratedBy, 5, 80);
    setTimeout(function () { doc.save(`Ficha Catalográfica - ${e_nome_autor}.pdf`) }, 1);
}


function splitName(name) {
    var name_splited = [];

    name_splited.push(name.split(' ').slice(-1).join(' '));
    name_splited.push(name.split(' ').slice(0, -1).join(' '));

    return name_splited;
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
    if (coorientador == '') {
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