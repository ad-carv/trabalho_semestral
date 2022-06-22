let isLogged = false;
let userLogged = { id: null };

const users = JSON.parse(window.sessionStorage.getItem('users')) || [
    { id: 1, name: "aluno1", email: "aluno1@teste.com", password: '123', tipo: 'aluno' },
    { id: 2, name: "aluno2", email: "aluno2@teste.com", password: '123', tipo: 'aluno' },
    { id: 3, name: "aluno3", email: "aluno3@teste.com", password: '123', tipo: 'aluno' },
    { id: 4, name: "professor1", email: "professor1@teste.com", password: '123', tipo: 'professor' },
    { id: 5, name: "professor2", email: "professor2@teste.com", password: '123', tipo: 'professor' },
    { id: 6, name: "professor3", email: "professor3@teste.com", password: '123', tipo: 'professor' },
];

const disciplines = JSON.parse(window.sessionStorage.getItem('disciplines')) || [
    { id: 1, name: "materia1", professor: users.filter(user => user.tipo === "professor")[0], users: [], activities: [] },
    { id: 2, name: "materia2", professor: users.filter(user => user.tipo === "professor")[1], users: [], activities: [] },
    { id: 3, name: "materia3", professor: users.filter(user => user.tipo === "professor")[2], users: [], activities: [] },
];

const activities = JSON.parse(window.sessionStorage.getItem('activities')) || [];

const grades = JSON.parse(window.sessionStorage.getItem('grades')) || [];


$(document).ready(function () {

    verificaUsuarioLogado();
    preencheTabelaAulas();
    preencherAtividadeAluno();
    preencherAtividadeAlunoProfessor();
    preencheTipoPai();
    preencheTabelaPaiAluno();
});


function preencheComboAlunos(select) {
    const element = $(select);
    users.forEach(user => {
        if (user.tipo === "aluno") {
            element.append(new Option(user.name, JSON.stringify(user)));
        }
    });
}

function verificaUsuarioLogado() {
    userLogged = JSON.parse(sessionStorage.getItem('user')) || {};
    if (userLogged && userLogged.id) {
        $("#menuAula").show();
        $("#linklogin").hide();
        $('#linkcadastrese').hide();
        $('#sair').show();
        $("#abertura").show();
        $("#abertura").text(`Olá ${userLogged.name}, ${userLogged.tipo}.`)
        mostraHabilidades(userLogged);
    } else {
        $("#menuAula").hide();
        $("#linklogin").show();
        $('#linkcadastrese').show();
        $('#sair').hide();
        $("#abertura").hide();
    }

    $("#alunoTipoPai").hide();
}

function preencherAtividadeAlunoProfessor() {
    const table = $('#tabelaAtividadesProfessor');

    disciplines.forEach(discipline => {
        if (discipline.professor.id === userLogged.id) {
            discipline.activities.forEach(activity => {
                activity.grades.forEach(grade => {
                    table.append(`
                        <tr>
                            <td>${discipline.name}</td>
                            <td>${activity.name}</td>
                            <td>${grade.user.name}</td>
                            <td>
                                <input name="grade" type="number" value="${grade.grade}" min="0" max="10"/>
                                <button class="btn btn-primary" onClick="adicionaNotaAtividade(${grade.user.id}, ${activity.id}, this)">Salvar</button>
                            </td>
                        </tr>
                   `);
                })
            })
        }
    });
}

function adicionaNotaAtividade(user, atividade, button) {
    const nota = $(button).parent().find("input").val();
    activities.map(activity => {
        if (activity.id === atividade) {
            activity.grades.map(grade => {
                if (grade.user.id === user) {
                    grade.grade = nota;
                }
            });
        }
    })

    disciplines.map(disciplina => {
        disciplina.activities.map(activity => {
            if (activity.id === atividade) {
                activity.grades.map(grade => {
                    if (grade.user.id === user) {
                        grade.grade = nota;
                    }
                });
            }
        });
    });

    sessionStorage.setItem('disciplines', JSON.stringify(disciplines));
    sessionStorage.setItem('activities', JSON.stringify(activities));
    window.location = window.location;
}


function preencherAtividadeAluno() {
    const table = $('#tableAtividadeAlnuo');

    disciplines.forEach(discipline => {
        if (discipline.users.filter(user => user.id === userLogged.id).length > 0) {
            discipline.activities.forEach(activity => {

                if (activity.grades.filter(grade => grade.user.id === userLogged.id).length > 0) {
                    activity.grades.forEach(grade => {
                        if (grade.user.id === userLogged.id) {
                            table.append(`
                            <tr>
                                <td>${discipline.name}</td>
                                <td>${activity.name}</td>
                                <td>${grade.grade}</td>
                                <td>--</td>
                            </tr>
                        `);
                        }
                    });
                } else {
                    table.append(`
                        <tr>
                            <td>${discipline.name}</td>
                            <td>${activity.name}</td>
                            <td>0</td>
                            <td><button class="btn btn-primary" onClick="adicionarEntrega(${activity.id})">Entregar</button></td>
                        </tr>
                    `);
                }
            });
        }
    });
}

function adicionarEntrega(idAtividade) {
    activities.map(activity => {
        if (activity.id === idAtividade) {
            activity.grades.push({ user: userLogged, grade: 0 });
        }
    })

    disciplines.map(disciplina => {
        disciplina.activities.map(activity => {
            if (activity.id === idAtividade) {
                activity.grades.push({ user: userLogged, grade: 0 });
            }
        });
    });

    sessionStorage.setItem('disciplines', JSON.stringify(disciplines));
    sessionStorage.setItem('activities', JSON.stringify(activities));
    window.location = window.location;
}


function preencheTabelaAulas() {
    disciplines.forEach(discipline => {
        if (discipline.professor.id === userLogged.id) {
            let list = "";
            discipline.users.forEach(user => {
                list += `<li>${user.name}</li>`;
            });


            $("#tabelaAulasProfessor").append(`
            <tr>
                <td>${discipline.name}</td>
                <td><ul>${list}</ul></td>
                <td>${discipline.activities.length}</td>
                <td>
                <a href="atividade.html?id=${discipline.id}">
                <button class="btn btn-primary">add atividade</button>
                </a>
                </td>
            </tr>`);
        }
    })
}


function mostraHabilidades() {
    const tipo = userLogged.tipo;
    switch (tipo) {

        case "aluno":
            $("#alunotabelaaulas").show();
            break;
        case "professor":
            $("#professortabelaaulas").show();
            preencheComboAlunos("#usuariosAulasProfessor");
            break;
        case "pai":
            $("#paitabelaaulas").show();
            break;
    }
}

$('#sair').click(function () {
    userLogged = {};
    sessionStorage.removeItem('user');
    window.location = "index.html";
})

$('#login').click(async function () {
    const email = $("#email").val();
    const password = $("#senha").val();

    const user = users.filter(user => user.email === email && user.password === password);
    if (user && user.length > 0) {
        isLogged = true;
        userLogged = user[0];
        sessionStorage.setItem('user', JSON.stringify(userLogged));
        window.location = "index.html";
    } else {
        alert('login invalido! tente novamente!');
    }
})

$('#cadastro').click(function () {
    const name = $("#nome").val();
    const tipo = $("#tipo").val();
    const email = $("#email").val();
    const password = $("#senha").val();

    if (tipo === "pai") {
        const pai = $("#alunoTipoPai").val();
        const user = { id: Math.random() + new Date().getTime(), name, email, password, tipo, pai };
        users.push(user);
        userLogged = user;
    } else {
        const user = { id: Math.random() + new Date().getTime(), name, email, password, tipo };
        users.push(user);
        userLogged = user;
    }

    sessionStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('user', JSON.stringify(userLogged));
    window.location = "index.html";
})

$("#criaAula").click(function () {
    const name = $("#aula").val();
    const users = $("#usuariosAulasProfessor").val().map(user => JSON.parse(user));
    disciplines.push({ id: disciplines.length + 1, name, professor: userLogged, users, activities: [] });

    sessionStorage.setItem('disciplines', JSON.stringify(disciplines));
    window.location = window.location;
})

$("#criaAtividade").click(function () {
    const id = eval(window.location.search.replaceAll("?id=", ""));

    if (id) {
        const name = $("#atividade").val();
        disciplines.find(discipline => discipline.id === id).activities.push({ id: Math.random() + new Date().getTime(), name, grades: [], professor: userLogged });

        activities.push({ id: Math.random() + new Date().getTime(), name, grades: [], professor: userLogged });

        sessionStorage.setItem('activities', JSON.stringify(activities));
        sessionStorage.setItem('disciplines', JSON.stringify(disciplines));
        window.location = "aulas.html";
    }
})

function preencheTipoPai() {
    users.forEach(user => {
        if (user.tipo == "aluno") {
            const element = $("#alunoTipoPai");
            element.append(`<option value="${user.id}">${user.name}</option>`);
        }
    })
}

function selectTipoChange() {
    const tipo = $("#tipo").val();
    if (tipo === "pai") {
        $("#alunoTipoPai").show();
    } else {
        $("#alunoTipoPai").hide();
    }
}

function preencheTabelaPaiAluno() {
    const tabelaPaiAluno = $("#tabelaPaiAluno");
    if(userLogged.tipo === "pai" && userLogged.pai){
        disciplines.forEach(discipline => {
            if (discipline.users.filter(user => user.id == userLogged.pai).length > 0) {
                discipline.activities.forEach(activity => {
                    if (activity.grades.filter(grade => grade.user.id == userLogged.pai).length > 0) {
                        activity.grades.forEach(grade => {
                            if (grade.user.id == userLogged.pai) {
                                tabelaPaiAluno.append(`
                                    <tr>
                                        <td>${discipline.name}</td>
                                        <td>${activity.name}</td>
                                        <td>${grade.grade}</td>
                                    </tr>
                                `);
                            }
                        });
                    } 
                });
            }
        });
    }
    
}