document.addEventListener('DOMContentLoaded', () => {
    const small = document.querySelector('.small');

    function loadFile(input) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = event.target.result;
            previewImage.style.objectFit = "contain";
            previewImage.style.borderRadius = "70%";
        };
        reader.readAsDataURL(file);
    }
    window.loadFile = loadFile;

    function imgcheck(chooseFile) {
        if (chooseFile.value == "") {
            alert("*프로필 사진을 추가해주세요.");
            return false;
        } else {
            return true;
        }
    }

    function emailcheck(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    }

    function duplicateEmail(users, email) {
        return !users.some(user => user.email === email);
    }

    function validateEmail(users, email) {
        if (email === "") {
            small.innerText = "*이메일을 입력해주세요.";
            return false;
        } else if (!emailcheck(email)) {
            small.innerText = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
            return false;
        } else if (!duplicateEmail(users, email)) {
            small.innerText = "*중복된 이메일입니다.";
            return false;
        }
        return true;
    }

    function passwordcheck(password, confirmPassword) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (!passwordRegex.test(password)) {
            alert("*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
            return false;
        } else if (password !== confirmPassword) {
            alert("*비밀번호가 다릅니다.");
            return false;
        } else if (password === "") {
            alert("*비밀번호를 입력해주세요.");
            return false;
        } else {
            return true;
        }
    }

    function nickNamecheck(nickName) {
        if (nickName == null || nickName === "") {
            alert("*닉네임 입력은 필수입니다.");
            small.innerText = "*닉네임 입력은 필수입니다.";
            return false;
        } else if (nickName.search(/\s/) !== -1) {
            alert("*띄어쓰기를 없애주세요");
            return false;
        } else if (nickName.length < 2 || nickName.length > 10) {
            alert("*닉네임은 최대 10자까지 작성 가능합니다.");
            return false;
        } else {
            return true;
        }
    }

    function duplicateNickName(users, nickName) {
        return !users.some(user => user.nickName === nickName);
    }

    async function registerUser() {
        const chooseFile = document.getElementById('chooseFile').files[0];
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const nickName = document.getElementById('nickName').value;

        const response = await fetch('/users');
        const users = await response.json();

        if (!imgcheck(chooseFile) || !validateEmail(users, email) || !passwordcheck(password, confirmPassword) || !nickNamecheck(nickName) || !duplicateNickName(users, nickName)) {
            return;
        }

        const data = {
            email: email,
            password: password,
            nickName: nickName,
            chooseFile: chooseFile ? chooseFile.name : null
        };

        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('회원가입이 성공적으로 완료되었습니다.');
                window.location.href = 'login.html';
            } else {
                throw new Error('Network response was not ok ' + response.statusText);
            }
        } catch (error) {
            console.error('회원가입 중 오류 발생:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    }

    document.getElementById('button1').addEventListener('click', registerUser);

    document.getElementById('button2').addEventListener('click', () => {
        window.location.href = 'login.html';
    });
});
