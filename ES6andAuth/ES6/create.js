const button1 = document.getElementById('button1');
const profileHelperText = document.getElementById('profileHelperText');
const emailHelperText = document.getElementById('emailHelperText');
const passwordHelperText = document.getElementById('passwordHelperText');
const confirmPasswordHelperText = document.getElementById('confirmPasswordHelperText');
const nickNameHelperText = document.getElementById('nickNameHelperText');
const chooseFile = document.getElementById('chooseFile');

const loadFile = input => {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = event => {
        const previewImage = document.getElementById('previewImage');
        previewImage.src = event.target.result;
        previewImage.style.objectFit = "contain";
        previewImage.style.borderRadius = "70%";
    };
    reader.readAsDataURL(file);
};
window.loadFile = loadFile;

const imgcheck = chooseFile => {
    if (!chooseFile || !chooseFile.name) {
        profileHelperText.innerText = "*프로필 사진을 추가해주세요.";
        return false;
    }
    return true;
};

const emailcheck = email => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

const validateEmail = (users, email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) {
        emailHelperText.innerText = "*이메일을 입력해주세요.";
        return false;
    } else if (!emailRegex.test(email)) {
        emailHelperText.innerText = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
        return false;
    } else if (!duplicateEmail(users, email)) {
        emailHelperText.innerText = "*중복된 이메일입니다.";
        return false;
    }
    return true;
};

const duplicateEmail = (users, email) => {
    return !users.some(user => user.email === email);
};

const passwordcheck = (password, confirmPassword) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
        passwordHelperText.innerText = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        return false;
    } else if (password !== confirmPassword) {
        confirmPasswordHelperText.innerText = "*비밀번호가 다릅니다.";
        return false;
    } else if (!password) {
        passwordHelperText.innerText = "*비밀번호를 입력해주세요.";
        return false;
    }
    return true;
};

const nickNamecheck = nickName => {
    if (!nickName) {
        nickNameHelperText.innerText = "*닉네임 입력은 필수입니다.";
        return false;
    }
    if (/\s/.test(nickName)) {
        nickNameHelperText.innerText = "*띄어쓰기를 없애주세요.";
        return false;
    }
    if (nickName.length < 2 || nickName.length > 10) {
        nickNameHelperText.innerText = "*닉네임은 최대 10자까지 작성 가능합니다.";
        return false;
    }
    return true;
};

const duplicateNickName = (users, nickName) => {
    return !users.some(user => user.nickName === nickName);
};

document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const chooseFile = document.getElementById('chooseFile').files[0];
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nickName = document.getElementById('nickName').value;

    const response = await fetch(`http://localhost:3000/users`);
    const users = await response.json();

    if (!imgcheck(chooseFile)) return;
    if (!validateEmail(users, email)) return;
    if (!passwordcheck(password, confirmPassword)) return;
    if (!nickNamecheck(nickName)) return;
    if (!duplicateNickName(users, nickName)) return;

    const data = {
        email,
        password,
        nickName,
        chooseFile: chooseFile ? chooseFile.name : null
    };

    try {
        const response = await fetch(`http://localhost:3000/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        const result = await response.json();
        if (result.message === 'User created') {
            alert('회원가입이 성공적으로 완료되었습니다.');
            window.location.href = 'login.html';
        } else {
            console.error('회원가입 실패:', result.message);
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    }
});

document.getElementById('button2').addEventListener('click', () => {
    window.location.href = 'login.html';
});