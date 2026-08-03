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

        registerButton.onclick = async function(e){


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


if(!nome || !email || !senha){

    alert("Preencha todos os campos");

    return;

}


console.log("ANTES DO SIGNUP:", {
    nome,
    email,
    senha
});


const resultado = await cadastrarUsuario(nome, email, senha);


console.log("DEPOIS DO SIGNUP:", resultado);






console.log(resultado);


            alert("Cadastro criado! Verifique seu email para confirmar a conta.");

            showLogin();

      };


    }


    // ============================
    // LOGIN
    // ============================


    if(loginButton){


        loginButton.onclick = async function(e){


            e.preventDefault();



            const email =
            document.getElementById("loginEmail")?.value.trim();



            const senha =
            document.getElementById("loginPassword")?.value.trim();




            const resultado = await supabaseClient.auth.signInWithPassword({

                email: email,

                password: senha

            });


            if(resultado.error){

                console.error(
                    "Erro login:",
                    resultado.error
                );

                alert("E-mail ou senha incorretos");

                return;

            }


            console.log(
                "Login Supabase:",
                resultado.data
            );

            const { data, error } = await supabaseClient.auth.getSession();

console.log("Sessão após login:", data.session);
console.log("Erro da sessão:", error);


            overlay.classList.remove("active");

            location.reload();
        
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

// ============================
// ESQUECI MINHA SENHA
// ============================

window.addEventListener("componentsLoaded", () => {


    const forgotPassword =
    document.getElementById("forgotPassword");


    console.log(
        "FORGOT PASSWORD ELEMENT:",
        forgotPassword
    );


    if(forgotPassword){


        forgotPassword.onclick = async function(e){


            e.preventDefault();


            const email =
            document
            .getElementById("loginEmail")
            ?.value
            .trim();



            if(!email){


                alert(
                    "Digite seu e-mail para recuperar a senha."
                );


                return;

            }



            const { data, error } =
                await supabaseClient.auth
                .resetPasswordForEmail(email, {

                    redirectTo:
                    "http://127.0.0.1:5500/pages/reset-password.html"

                });


                console.log("RESET DATA:", data);
                console.log("RESET ERROR:", error);


                if(error){

                    alert(
                        "Erro ao enviar recuperação de senha."
                    );

                    return;

                }



            alert(
                "Email de recuperação enviado. Verifique sua caixa de entrada."
            );


        };


    }


});