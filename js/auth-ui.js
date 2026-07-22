function initAuth(){


    const overlay =
    document.getElementById("authOverlay");


    if(!overlay){

        return;

    }



    const loginBtn =
    document.getElementById("openLogin");


    const registerBtn =
    document.getElementById("openRegister");


    const mobileLogin =
    document.getElementById("mobileLogin");


    const mobileRegister =
    document.getElementById("mobileRegister");


    const footerLogin =
    document.getElementById("footerLogin");


    const footerRegister =
    document.getElementById("footerRegister");


    const closeBtn =
    document.getElementById("closeAuth");


    const loginButton =
    document.getElementById("loginButton");


    const registerButton =
    document.getElementById("registerButton");




    // ============================
    // ABRIR LOGIN
    // ============================

    function abrirLogin(){

        overlay.classList.add("active");

        showLogin();

    }




    // ============================
    // ABRIR CADASTRO
    // ============================

    function abrirCadastro(){

        overlay.classList.add("active");

        showRegister();

    }




    // HEADER

    if(loginBtn){

        loginBtn.onclick = abrirLogin;

    }


    if(registerBtn){

        registerBtn.onclick = abrirCadastro;

    }



    // MOBILE

    if(mobileLogin){

        mobileLogin.onclick = abrirLogin;

    }


    if(mobileRegister){

        mobileRegister.onclick = abrirCadastro;

    }





    // FOOTER

    if(footerLogin){

        footerLogin.onclick = function(e){

            e.preventDefault();

            abrirLogin();

        };

    }



    if(footerRegister){

        footerRegister.onclick = function(e){

            e.preventDefault();

            abrirCadastro();

        };

    }







    // ============================
    // CADASTRO
    // ============================


    if(registerButton){

        registerButton.onclick = function(e){


            e.preventDefault();



            const nome =
            document.getElementById("registerName")?.value.trim();



            const email =
            document.getElementById("registerEmail")?.value.trim();



            const senha =
            document.getElementById("registerPassword")?.value.trim();




            if(!nome || !email || !senha){

                alert("Preencha todos os campos");

                return;

            }




            const novoUsuario = {


                nome:nome,


                email:email,


                senha:senha,


                dataCadastro:
                new Date().toLocaleDateString("pt-BR"),


                avatar:
                "img/avatar.jpg",


                favoritos:[],


                biblioteca:[],


                baixadas:[],


                atividades:[]


            };




            Auth.register(novoUsuario);



            alert("Cadastro realizado com sucesso");



            showLogin();



        };


    }








    // ============================
    // LOGIN
    // ============================


    if(loginButton){


        loginButton.onclick = function(e){


            e.preventDefault();



            const email =
            document.getElementById("loginEmail")?.value.trim();



            const senha =
            document.getElementById("loginPassword")?.value.trim();




            const usuarios =
            Auth.getRegister();




            if(!usuarios || usuarios.length === 0){


                alert("Nenhum usuário cadastrado");


                return;


            }





            const usuario =
            usuarios.find(user =>


                user.email === email &&
                user.senha === senha


            );





            if(usuario){


                Auth.login(usuario);



                overlay.classList.remove("active");



                location.reload();



            }else{


                alert("E-mail ou senha incorretos");


            }




        };


    }








    // ============================
    // FECHAR MODAL
    // ============================


    if(closeBtn){


        closeBtn.onclick = function(){


            overlay.classList.remove("active");


        };


    }





    document.addEventListener("keydown",function(e){


        if(e.key === "Escape"){


            overlay.classList.remove("active");


        }


    });







    // ============================
    // TROCAR LOGIN / CADASTRO
    // ============================


    const switchRegister =
    document.getElementById("switchRegister");



    if(switchRegister){


        switchRegister.onclick = function(e){


            e.preventDefault();


            showRegister();


        };


    }





    const switchLogin =
    document.getElementById("switchLogin");



    if(switchLogin){


        switchLogin.onclick = function(e){


            e.preventDefault();


            showLogin();


        };


    }



}









// ============================
// MOSTRAR LOGIN
// ============================


function showLogin(){


    const loginForm =
    document.getElementById("loginForm");



    const registerForm =
    document.getElementById("registerForm");




    if(loginForm){

        loginForm.style.display="block";

    }




    if(registerForm){

        registerForm.style.display="none";

    }


}









// ============================
// MOSTRAR CADASTRO
// ============================


function showRegister(){


    const loginForm =
    document.getElementById("loginForm");



    const registerForm =
    document.getElementById("registerForm");





    if(loginForm){

        loginForm.style.display="none";

    }





    if(registerForm){

        registerForm.style.display="block";

    }


}