const email = "test2@email.com"; 

const fetchUserData = async email => {
    try {
        const response = await fetch(`http://localhost:3000/users/${email}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const user = await response.json();
        if (user) {
            document.getElementById('email').textContent = user.email;
            document.getElementById('nickName').value = user.nickName;
            if (user.chooseFile) {
                const imageUrl = user.chooseFile.startsWith('http') ? user.chooseFile : `/uploads/${user.chooseFile}`;
                document.getElementById('previewImage').src = imageUrl;
            }
        } else {
            alert("User not found");
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

fetchUserData(email);

document.getElementById('updateForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').textContent;
    const nickName = document.getElementById('nickName').value;
    const chooseFile = document.getElementById('chooseFile').files[0];

    if (!nickNamecheck(nickName)) return;

    const data = { email, nickName, chooseFile: chooseFile ? chooseFile.name : null };

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        if (result.message === 'User updated') {
            toast('수정 완료');
        } else {
            alert('수정 실패');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('수정하지 못했습니다. 다시 시도해주세요.');
    }
});

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

const nickNamecheck = nickName => {
    if (!nickName) {
        alert("*닉네임 입력은 필수입니다.");
        return false;
    }
    if (/\s/.test(nickName)) {
        alert("*띄어쓰기를 없애주세요");
        return false;
    }
    if (nickName.length < 2 || nickName.length > 10) {
        alert("*닉네임은 최대 10자까지 작성 가능합니다.");
        return false;
    }
    return true;
};

document.querySelector('.button2').addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'block';
});

document.querySelector('.close_btn').addEventListener('click', () => {
    document.querySelector('.modal').style.display = 'none';
});

document.querySelector('.yes_btn').addEventListener('click', async () => {
    try {
        const email = document.getElementById('email').textContent;
        const response = await fetch(`http://localhost:3000/users/${email}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            alert('탈퇴 처리되었습니다.');
            window.location.href = "login.html";
        } else {
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
        document.querySelector('.modal').style.display = 'none';
    }
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
