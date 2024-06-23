// 이메일 유효성 검사 로직
const emailInput = document.getElementById('email');
const emailHelperText = document.getElementById('emailHelperText');

const emailcheck = email => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
};

// 이메일 유효성 검사 로직
const validateEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!email) {
      emailHelperText.innerText = "*이메일을 입력해주세요.";
      return false;
  } else if (!emailRegex.test(email)) {
      emailHelperText.innerText = "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
      return false;
  }
  emailHelperText.innerText = ''; // 유효성 검사가 통과된 경우
  return true;
};

emailInput.addEventListener('change', () => {
    validateEmail(emailInput.value.trim());
    changeButtonColor();
});

// 비밀번호 유효성 검사 로직
const passwordInput = document.getElementById('password');
const passwordHelperText = document.getElementById('passwordHelperText');

const passwordcheck = password => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  if (!password) {
      passwordHelperText.innerText = "*비밀번호를 입력해주세요.";
      return false;
  } else if (!passwordRegex.test(password)) {
      passwordHelperText.innerText = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
      return false;
  }
  passwordHelperText.innerText = ''; // 유효성 검사가 통과된 경우
  return true;
};

passwordInput.addEventListener('change', () => {
    passwordcheck(passwordInput.value.trim());
    changeButtonColor();
});

// 버튼 색상 변경 로직
function changeButtonColor() {
  const button = document.getElementById('button1');
  const emailValid = validateEmail(emailInput.value.trim());
  const passwordValid = passwordcheck(passwordInput.value.trim(), confirmPasswordInput.value.trim());
  if (emailValid && passwordValid) {
        button.style.backgroundColor = '#7f6aee'; //유효O
    } else {
        button.style.backgroundColor = '#ACA0EB'; //유효X
    }
}

// 로그인 버튼 클릭 이벤트
const button = document.getElementById('button1');
button.addEventListener('click', async (event) => {
    event.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'  // 쿠키 포함하여 POST 요청
        });

        const data = await response.json();
        console.log(data);  // Add this line to check the response

        if (data.status === 200) {
            alert('환영합니다, ' + email + '님!');
            console.log('Redirecting to /main');  // Add this line to check if redirection is called
            window.location.href = '/main';  // Ensure this URL is correct and accessible
        } else {
            alert('로그인 실패: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버에 연결할 수 없습니다.');
    }
});
