const button = document.getElementById('button');
const small = document.querySelector('.small');

const passwordcheck = password => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(password)) {
        alert("*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
        return false;
    } else if (!password) {
        alert("*비밀번호를 입력해주세요.");
        return false;
    } else {
        return true;
    }
};

const confirmPasswordcheck = (password, confirmPassword) => {
    if (password !== confirmPassword) {
        small.innerText = "*비밀번호가 다릅니다.";
        return false;
    } else if (!confirmPassword) {
        small.innerText = "*비밀번호를 한 번 더 입력해주세요.";
        return false;
    } else {
        return true;
    }
};

const updatePassword = async () => {
    try {
        const password = document.getElementById('password').value;
        await fetch(`/http://localhost:3000/users`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
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

    await updatePassword();
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
