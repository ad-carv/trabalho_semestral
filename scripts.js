$(document).ready(function(){
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user){
        console.log(user)
        $("#linklogin").hide();
        $('#linkcadastrese').hide();
        $('#sair').show();
        $("#abertura").show();
        $("#abertura").text(`Olá ${user.nome}, ${user.tipo}.`)
        mostraHabilidades(user);
    }else{
        $("#linklogin").show();
        $('#linkcadastrese').show();
        $('#sair').hide();
        $("#abertura").hide();
    }
});

async function mostraHabilidades(user){
    const tipo = user.tipo;
    switch(tipo){
        case "aluno":
            $("#alunotabelaaulas").show();
            break;
        case "professor":
            $("#professortabelaaulas").show();
            await preencheComboAlunos("#usuariosAulasProfessor");
            break;
        case "pai":
            $("#pai").show();
            break;
    }
}

$('#sair').click(function(){
    sessionStorage.clear();
    window.location = window.location;
})

$('#login').click(async function(){
    const email = $("#email").val();
    const password = $("#senha").val();

    const response = await axios.get("https://62704c95e1c7aec428f212a6.mockapi.io/users");
    const userlist = response.data;
    let user = undefined;
    userlist.forEach(element => {
        if(element.email === email && element.senha ===password){
            user = element;
        }
    });

   

    if(response.status >= 200 && response.status < 300 ){
        if(user)
        {
            sessionStorage.setItem('user', JSON.stringify(user));
        }else{
            alert("Usuário e senha invalidos!")
        }
    }else{
        alert("Erro ao fazer login!")
    }
    window.location = window.origin + "/index.html";
})


$('#cadastro').click(async function (){
    const nome = $("#nome").val();
    const sobrenome = $("#sobrenome").val();
    const tipo = $("#tipo").val();
    const email = $("#email").val();
    const password = $("#senha").val();
    const user = {nome, sobrenome, tipo,email, "senha" : password};

    const response = await axios.post("https://62704c95e1c7aec428f212a6.mockapi.io/users", user);
    
    if(response.status >= 200 && response.status < 300 ){
        sessionStorage.setItem('user', JSON.stringify(user));
    }else{
        alert("Não foi possível realizar cadastro!")
    }
    window.location = window.origin + "/index.html";
})

async function preencheComboAlunos(select){
    const response = await axios.get("https://62704c95e1c7aec428f212a6.mockapi.io/users");
    const element = $(select);
    response.data.forEach(usuario => {
        if(usuario.tipo === "aluno"){
            element.append(new Option(usuario.nome, JSON.stringify(usuario)));
        }
    });
}

$("#criaAula").click(async function(){
    const aula = $("#aula").val();
    const usuarios = $("#usuariosAulasProfessor").val();
    const response = await  axios.post("https://62704c95e1c7aec428f212a6.mockapi.io/Aulas", {nome: aula, Usuarios: usuarios.map(u => JSON.parse(u))});

    if(response.status >= 200 && response.status < 300){
        alert('criou com sucesso!')
    }else{
        alert('Falha ao criar aula');
    }
})