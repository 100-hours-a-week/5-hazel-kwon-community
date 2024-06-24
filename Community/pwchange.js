const button = document.getElementById('button');
const small = document.querySelector('.small');

    //비밀번호 입력(유효성 체크, 입력 안 했을 때, 틀렸을 때)
    function passwordcheck(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        if (!passwordRegex.test(password)) {
            alert("*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.");
            return false;
        } else if (password.value === "") {
            alert("*비밀번호를 입력해주세요.");
            return false;
        } else {
            return true;
        }
    };

    //비밀번호 확인 입력
    function confirmPasswordcheck(confirmPassword) {
        if (password.value !== confirmPassword.value) {
            innersmall.InnerText = "*비밀번호가 다릅니다.";
            return false;
        } else if (confirmPassword.value == "") {
            innersmall.InnerText ="*비밀번호를 한 번 더 입력해주세요.";
            return false;
        } else if (password.value === confirmPassword.value) {
            return true;
        }
    };

    function confirmPasswordcheck(users, email, password) {
        for(let i = 0; i<users.length; i++) { 
            if (users[i].email == email && users[i].password !== password) {
                innersmall.InnerText = "*비밀번호가 다릅니다.";
                return false;
            } else if (users[i].email == email && "" == password) {
                innersmall.InnerText = "*비밀번호를 한 번 더 입력해주세요.";
                return true;
            }
        };
        return false;
    }

// 서버로 요청을 보내는 fetch() 추가
fetch('/DB.json', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })   //JSON -> 문자열
  })
  //서버 요청에 대한 응답이 왔을 때 실행, 응답을 JSON으로 파싱(문자열->json 데이터)
  .then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('서버에서 오류가 발생했습니다.');
  }
  })
  // json 데이터로 변경되면 전달
  .then(data => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // 비밀번호 함수 호출
        if (!passwordcheck(password)) {
            return;
        };
    
        // 비밀번호 확인 함수 호출
        if (!confirmPasswordcheck(confirmPassword)) {
            return;
        };
    });
  })

  //에러 처리
  .catch(error => {
  console.error(error);
  alert('서버에 연결할 수 없습니다.');
  });

    // 수정 완료 토스트 메시지 표시
    function toast(string) {
        const toast = document.getElementById("toast");

        toast.classList.contains("reveal") ?
        (clearTimeout(removeToast), removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)) :
        removeToast = setTimeout(function () {
            document.getElementById("toast").classList.remove("reveal")
        }, 1000)
        toast.classList.add("reveal"),
        toast.innerText = string
    }