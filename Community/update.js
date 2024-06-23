const email = "email@email.com"; // 이 부분을 실제 로그인된 사용자의 이메일로 설정해야 합니다.

fetch(`http://localhost:3000/users/${email}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(user => {
        if (user) {
            document.getElementById('email').textContent = user.email;
            document.getElementById('nickName').value = user.nickName;
            if (user.chooseFile) {
                const imageUrl = user.chooseFile.startsWith('http') ? user.chooseFile : `/uploads/${user.chooseFile}`;
                document.getElementById('previewImage').src = imageUrl;            }
        } else {
            alert("User not found");
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });

document.getElementById('updateForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').textContent;
    const nickName = document.getElementById('nickName').value;
    const chooseFile = document.getElementById('chooseFile').files[0];

    if (!nickNamecheck(nickName)) {
        return;
    }

    const data = {
        email: email,
        nickName: nickName,
        chooseFile: chooseFile ? chooseFile.name : null
    };

    fetch(`http://localhost:3000/users`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'User updated') {
            toast('수정 완료');
        } else {
            alert('수정 실패');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('수정하지 못했습니다. 다시 시도해주세요.');
    });
});

// 프로필 사진 유효성 검사
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

// 닉네임 유효성 검사
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

// 닉네임 중복 검사
const duplicateNickName = (users, nickName) => users.every(user => user.nickName !== nickName);

// 회원 탈퇴 모달 창 열기
const modal = document.querySelector('.modal');
const modalOpen = document.querySelector('.button2');
const modalClose = document.querySelector('.close_btn');
const mdClose = document.querySelector('.yes_btn');

modalOpen.addEventListener('click', function () {
    modal.style.display = 'block';
});

modalClose.addEventListener('click', function () {
    modal.style.display = 'none';
});

mdClose.addEventListener('click', async function () {
    try {
        const email = document.getElementById('email').textContent;
        const response = await fetch(`http://localhost:3000/users/${email}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
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
        modal.style.display = 'none';
    }
});

// 수정 완료 토스트 메시지 표시
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
      console.log('Logout response:', data);  // Debug log
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