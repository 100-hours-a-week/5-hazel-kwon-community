const button = document.getElementById('button');
const small = document.querySelectorAll('.small');

const passwordcheck = password => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
        small.forEach(s => s.innerText = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
        return false;
    } else if (!password) {
        small.forEach(s => s.innerText = "*비밀번호를 입력해주세요.");
        return false;
    } else {
        return true;
    }
};

const confirmPasswordcheck = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        small.forEach(s => s.innerText = "*비밀번호가 다릅니다.");
        return false;
    } else if (!confirmPassword) {
        small.forEach(s => s.innerText = "*비밀번호를 한 번 더 입력해주세요.");
        return false;
    } else {
        small.forEach(s => s.innerText = "");
        return true;
    }
};

const updatePassword = async (password) => {
    try {
        const response = await fetch('http://localhost:3000/users/password', {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('서버에 연결할 수 없습니다.');
        }

        const data = await response.json();
        if (data.message === 'Password updated') {
            toast('수정 완료');
        } else {
            alert('수정 실패');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버에 연결할 수 없습니다.');
    }
};

button.addEventListener("click", async (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!passwordcheck(password)) return;
    if (!confirmPasswordcheck(password, confirmPassword)) return;

    await updatePassword(password);
});

const toast = message => {
    const toastElement = document.getElementById("toast");

    if (toastElement.classList.contains("reveal")) {
        clearTimeout(removeToast);
        removeToast = setTimeout(() => {
            toastElement.classList.remove("reveal");
        }, 1000);
    } else {
        removeToast = setTimeout(() => {
            toastElement.classList.remove("reveal");
        }, 1000);
    }
    toastElement.classList.add("reveal");
    toastElement.innerText = message;
};

// 회원정보 수정
document.getElementById('update').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/update';
});

// 비밀번호 수정
document.getElementById('pwchange').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/pwchange';
});

// 로그아웃
document.getElementById('logout').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (data.status === 200) {
            alert('로그아웃 되었습니다.');
            window.location.href = '/login';
        } else {
            alert('로그아웃 중 문제가 발생했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('서버에 연결할 수 없습니다.');
    }
});