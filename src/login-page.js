const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "Ana" && password === "111") {
        alert("Professora Logada");
        window.location.href = './home_prof.html'
    }else if(username === "Teresa" && password === "222"){
        alert("Professora Logada");
        window.location.href = './home_prof.html'
    }else if(username === "Pedro" && password === "333"){
        alert("Aluno Logado");
        window.location.href = './home_aluno.html'
    }else if(username === "Tiago" && password === "444"){
        alert("Aluno Logado");
        window.location.href = './home_aluno.html'
    }else if(username === "Pai do Pedro" && password === "555"){
        alert("Pai Logado");
        window.location.href = './home_pais.html'
    }else if(username === "Pai do Tiago" && password === "666"){
        alert("Pai Logado");
        window.location.href = './home_pais.html'
    }else if(username === "Secretario" && password === "777"){
        alert("Secretario Logado");
        window.location.href = './home_sec.html'
    } else {
        alert("Usuário / senha incorretos");
    }
})