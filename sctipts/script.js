window.onload = function () {


    const fullNameElement = $('#full-name');
    const emailElement = $('#email');
    const usernameElement = $('#username');
    const passwordElement = $('#password');
    const repeatPasswordElement = $('#repeat-password');
    const checkBoxElement = $('#reg-form-check');
    const myAlert = $('#my-alert');
    const alertText = $('#alert-text');
    const alertButton = $('#alert-button');
    const form = $('#reg-forms');
    const linkAccount = $('#link-account');
    const titleElement = $('#form-info-title');
    const buttonElement = $('#button');
    const regForm = $('.reg-form');
    const invalidFeedbackElement = $('.invalid-feedback');



    fullNameElement.on('keydown', function (e) {
        if (!isNaN(parseInt(e.key)) && e.key !== " ") {
            e.preventDefault();
        }
    });

    //В поле "Your username" запретите вводить точки и запятые.
    usernameElement.on('input', function () {
        const newValue = usernameElement.val().replace(/[.,]/g, '');
        usernameElement.val(newValue);
    });

    form.on('submit', registerFormListener);


    function registerFormListener(event) {
        event.preventDefault();
        const fullName = fullNameElement.val().trim();
        const email = emailElement.val().trim();
        const username = usernameElement.val().trim();
        const password = passwordElement.val();
        const repeatPassword = repeatPasswordElement.val();
        const agree = checkBoxElement.prop('checked');

        regForm.each(function () {
            $(this).css({
                borderColor: '#C6C6C4',
                marginBottom: '20px'
            });
        });

        invalidFeedbackElement.each(function () {
            $(this).text('');
        });
        let hasError = false;

        //Validate fullName
        if (!fullName) {
            invalidMessage(fullNameElement, 'Пожалуйста, введите имя.');
            hasError = true;
        } else {
            const fullNamePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
            if (!fullNamePattern.test(fullName)) {
                invalidMessage(fullNameElement, 'Имя может содержать только буквы и пробелы.');
                hasError = true;
            }
        }

        // Validate userName
        if (!username) {
            invalidMessage(usernameElement, 'Пожалуйста, введите имя пользователя.');
            hasError = true;
        } else {
            const usernamePattern = /^[A-Za-zА-Яа-яЁё0-9_-]+$/;
            if (!usernamePattern.test(username)) {
                invalidMessage(usernameElement, 'Имя пользователя может содержать только буквы, цифры, символ подчеркивания и тире.');
                hasError = true;
            }
        }


        // Validate email
        if (!email) {
            invalidMessage(emailElement, 'Пожалуйста, введите email.');
            hasError = true;
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                invalidMessage(emailElement, 'Пожалуйста, введите корректный адрес электронной почты.');
                hasError = true;
            }
        }


        // Validate password
        if (!password) {
            invalidMessage(passwordElement, 'Пожалуйста, введите пароль.');
            hasError = true;
        } else if (password.length < 8) {
            invalidMessage(passwordElement, 'Пароль должен содержать не менее 8 символов.');
            hasError = true;
        } else {
            const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!passwordPattern.test(password)) {
                invalidMessage(passwordElement, 'Пароль должен содержать хотя бы одну заглавную букву, одну цифру и один спецсимвол.');
                hasError = true;
            }
        }

        // Validate repeat password
        if (!repeatPassword) {
            invalidMessage(repeatPasswordElement, 'Повторите пароль.');
            hasError = true;
        } else if (password !== repeatPassword) {
            invalidMessage(repeatPasswordElement, 'Пароли не совпадают.');
            hasError = true;
        }

        // Check agreement with terms
        if (!agree) {
            invalidMessage(checkBoxElement, 'Вы должны согласиться с условиями обслуживания.');
            hasError = true;
        }

        if (!hasError) {
          hasError = registerUser(fullName, email, username, password);
            form.trigger('reset');
        }

        if (!hasError) {
            myAlertPopUp('На вашу почту выслана ссылка для завершения регистрации');
        }
    }

    function invalidMessage(element, message) {
        if (element !== null) {
            element.css({
                borderColor: 'red',
                marginBottom: '0'
            }).next().text(message);
        }
    }

    function registerUser(fullName, email, username, password) {

        const newUser = {
            fullName: fullName,
            email: email,
            username: username,
            password: password
        };

        let clients = JSON.parse(localStorage.getItem('clients')) || [];

        const userExists = clients.some(client => client.email === email || client.username === username);

        if (userExists) {
            myAlertMessage('Такой пользователь уже зарегистрирован');
            return true;
        }

        clients.push(newUser);

        localStorage.setItem('clients', JSON.stringify(clients));

        console.log('User registered successfully:', newUser);
        return false;
    }

    function alertButtonPopUp() {
        myAlert.css('display', 'none');
        showSignInPage()
    }

    function myAlertPopUp(message) {
        myAlert.css('display', 'flex');
        alertText.text(message);
        alertButton.on('click', alertButtonPopUp)
    }

    function myAlertMessage(message) {
        myAlert.css('display', 'flex');
        alertText.text(message);
        alertButton.on('click', alertButtonPopUp);
        alertButton.on('click', alertButtonSimple)
    }

    function alertButtonSimple() {
        myAlert.css('display', 'none');

    }
    function pageSignIn (e) {
        e.preventDefault();
        showSignInPage();
    }

    function pageReload (e){
        e.preventDefault();
        location.reload();
    }

    linkAccount.on('click', pageSignIn)


    function showSignInPage() {

        $('#repeat-password-label').css('display', 'none');
        $('#email-label').css('display', 'none');
        $('#full-name-label').css('display', 'none');
        $('#check-label').css('display', 'none');
        buttonElement.text('Sign In');
        titleElement.text('Log in to the system');
        linkAccount.on('click', pageReload);
        linkAccount.text('Registration');

        regForm.each(function () {
            $(this).css({
                borderColor: '#C6C6C4',
                marginBottom: '20px'
            });
        });

        invalidFeedbackElement.each(function () {
            $(this).text('');
        });


        form.on('submit', authorizationFormListener);

        function authorizationFormListener(event) {
            event.preventDefault();
            const password = passwordElement.val().trim();
            const username = usernameElement.val().trim();
            let hasError = false;

            regForm.each(function () {
                $(this).css({
                    borderColor: '#C6C6C4',
                    marginBottom: '20px'
                });
            });

            invalidFeedbackElement.each(function () {
                $(this).text('');
            });


            if (!username) {
                invalidMessage(usernameElement, 'Пожалуйста, введите имя пользователя.');
                hasError = true;
            }

            if (!password) {
                invalidMessage(passwordElement, 'Пожалуйста, введите пароль.');
                hasError = true;
            }

            let user;
            if (!hasError) {
              user = findObjectByName( JSON.parse(localStorage.getItem('clients')), username);
              if (!user) {
                  invalidMessage(usernameElement, 'Пользователь не зарегистрирован');
                  return;
              }
              if (user.password !== password) {
                  invalidMessage(passwordElement, 'Неверный пароль.');
                  return;
              }
            }

            if (!hasError) {
               showPersonaAccount(user);
            }
        }

        function findObjectByName(list, username) {
            return list.find((obj) => obj.username === username);
        }
    }
    function showPersonaAccount (user) {
        if (user) {
        titleElement.text('Welcome, ' + user.fullName + '!');
        $('#username-label').css('display', 'none');
        $('#password-label').css('display', 'none');
        linkAccount.css('display', 'none');
        $('.form-info-text').css('display', 'none');
        buttonElement.text('Exit').on('click', pageReload);

    }
    }
}