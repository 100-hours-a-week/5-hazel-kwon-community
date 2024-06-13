const button1 = document.getElementById('button1');
const profileHelperText = document.getElementById('profileHelperText');
const emailHelperText = document.getElementById('emailHelperText');
const passwordHelperText = document.getElementById('passwordHelperText');
const confirmPasswordHelperText = document.getElementById('confirmPasswordHelperText');
const nickNameHelperText = document.getElementById('nickNameHelperText');
const chooseFile = document.getElementById('chooseFile');


// 이미지 업로드
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

// 프로필 사진 유효성 검사
function imgcheck(chooseFile) {
    if ((chooseFile.name === undefined) && (chooseFile.name == "")) {
        profileHelperText.innerText = "*프로필 사진을 추가해주세요.";
        return false;
    } 
    else {
        return true;
    }
};

//이메일 입력(유효성 체크, 너무 짧을 때, 비어 있을 때, 틀렸을 때)
function emailcheck(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        return false;
    } else {
        return true;
    }
};

//이메일 유효성 검사
function validateEmail(users, email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email === "") {
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
}

//이메일 중복 검사
function duplicateEmail(users,email){
    for(let i = 0; i< users.length; i++){
        if (users[i].email == email){
            return false;
        }
    }   return true;
}

//비밀번호 입력(유효성 체크, 입력 안 했을 때, 틀렸을 때)
function passwordcheck(password, confirmPassword) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
        passwordHelperText.innerText = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
        return false;
    } else if (password !== confirmPassword) {
        confirmPasswordHelperText.innerText = "*비밀번호가 다릅니다.";
        return false;
    } else if (password === "") {
        passwordHelperText.innerText = "*비밀번호를 입력해주세요.";
        return false;
    } else {
        return true;
    }
};

//닉네임 입력
function nickNamecheck(nickName) {
    const engCheck = /[a-z]/;
    const numCheck = /[0-9]/;
    const specialCheck = /[`~!@#$%^&*|\\\'\";:\/?]/gi;

    if (nickName == null || nickName == "") {   //닉네임 필수 입력
        alert("*닉네임 입력은 필수입니다.");
        nickNameHelperText.innerText = "*닉네임 입력은 필수입니다.";
        return false;
    } 
    else if (nickName.search(/\s/) != -1) {  //닉네임에 공백 있을 때
        nickNameHelperText.innerText = "*띄어쓰기를 없애주세요.";
        return false;
    } 
    else if (nickName.Length<2 || nickName.Length>10) {  //닉네임 한글 1~10자, 영문 및 숫자 2~20자
        nickNameHelperText.innerText = "*닉네임은 최대 10자까지 작성 가능합니다.";
        return false;
    } 
    else {
        return true;
    }
};

//닉네임 중복 검사
function duplicateNickName(users, nickName){
    for(let i = 0; i< users.length; i++){
        if (users[i].nickName == nickName){
            return false;
        }   
    }   
    return true;
}

document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const chooseFile = document.getElementById('chooseFile').files[0];
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const nickName = document.getElementById('nickName').value;

    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    // 프로필 사진 함수 호출
    if (!imgcheck(chooseFile)) {
        return;
    };

    // 이메일 함수 호출
    if (!validateEmail(users, email)) {
        return;
    };

    // 비밀번호 함수 호출
    if (!passwordcheck(password, confirmPassword)) {
        return;
    };

    // 닉네임 함수 호출
    if (!nickNamecheck(nickName)) {
        return;
    };

    // 닉네임 중복 함수 호출
    if (!duplicateNickName(users, nickName)) {
        return;
    };

    // JSON 형식으로 데이터 전송
    const data = {
        email: email,
        password: password,
        nickName: nickName,
        chooseFile: chooseFile ? chooseFile.name : null // 파일 경로 문자열로 전송
    };

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            if (result.message === 'User created') {
                alert('회원가입이 성공적으로 완료되었습니다.');
                window.location.href = 'login.html';
            } else {
                console.error('회원가입 실패:', result.message);
            }
        } else {
            throw new Error('Network response was not ok ' + response.statusText);
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    }
});

document.getElementById('button2').addEventListener('click', () => {
    window.location.href = 'login.html';
});