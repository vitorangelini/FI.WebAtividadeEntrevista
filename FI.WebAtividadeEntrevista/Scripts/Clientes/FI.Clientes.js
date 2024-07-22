var beneficiarios = [];
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpf = $(this).find("#CPF").val();

        if (validarCPF(cpf) != true) {
            ModalDialog("Erro", "Por favor preencha um cpf valido.")
            return;
        } else {
            $.ajax({
                url: urlPost,
                method: "POST",
                datatype: "JSON",
                data: {
                    "NOME": $(this).find("#Nome").val(),
                    "CPF": $(this).find("#CPF").val(),
                    "CEP": $(this).find("#CEP").val(),
                    "Email": $(this).find("#Email").val(),
                    "Sobrenome": $(this).find("#Sobrenome").val(),
                    "Nacionalidade": $(this).find("#Nacionalidade").val(),
                    "Estado": $(this).find("#Estado").val(),
                    "Cidade": $(this).find("#Cidade").val(),
                    "Logradouro": $(this).find("#Logradouro").val(),
                    "Telefone": $(this).find("#Telefone").val(),
                    "Beneficiario": JSON.stringify(beneficiarios)  
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (r) {
                        ModalDialog("Sucesso!", r)
                        $("#formCadastro")[0].reset();
                        $("#formBeneficiario")[0].reset();
                        $("#grid").val();
                    }
            });
        }
    })
})
function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); 

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; 
    }

    var soma = 0;
    var resto;
    for (var i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false; 
    }

    soma = 0;
    for (var i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false; 
    }

    return true; 
}
function adicionarLinha() {
    var nomeBeneficiario = document.getElementById('NomeBeneficiario').value;
    var cpfBeneficiario = document.getElementById('CpfBeneficiario').value;

    if (nomeBeneficiario.trim() === '' || cpfBeneficiario.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (validarCPF(cpfBeneficiario) != true) {

        alert('Por favor, preencha um cpf valido.');
        document.getElementById('NomeBeneficiario').value = '';
        document.getElementById('CpfBeneficiario').value = '';
        return;

    } else {

        if (VerificaCpf(cpfBeneficiario) == true) {
            alert('Cpf ja cadastrado para esse cliente.');
            document.getElementById('NomeBeneficiario').value = '';
            document.getElementById('CpfBeneficiario').value = '';
            return;

        } else {
            var table = document.getElementById('grid').getElementsByTagName('tbody')[0];
            var newRow = table.insertRow();
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);

            cell1.innerHTML = nomeBeneficiario;
            cell2.innerHTML = cpfBeneficiario;
            cell3.innerHTML = '<button class="btn btn-sm btn-primary" onclick="editarLinha(this)">Alterar</button> <button class="btn btn-sm btn-primary" onclick="removerLinha(this)">Excluir</button>';

            beneficiarios.push({ nome: nomeBeneficiario, cpf: cpfBeneficiario });

            document.getElementById('NomeBeneficiario').value = '';
            document.getElementById('CpfBeneficiario').value = '';
        }
    }
}
function editarLinha(btn) {
    
    var row = btn.parentNode.parentNode;
    var cells = row.getElementsByTagName('td');

    var nome = cells[0].innerHTML;
    var cpf = cells[1].innerHTML;

    document.getElementById('NomeBeneficiario').value = nome;
    document.getElementById('CpfBeneficiario').value = cpf;

    row.parentNode.removeChild(row);
}
function removerLinha(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}
function VerificaCpf(cpf) {
    for (var i = 0; i < beneficiarios.length; i++) {
        if (beneficiarios[i].cpf === cpf) {
            return true;
        }
    }
    return false;
}