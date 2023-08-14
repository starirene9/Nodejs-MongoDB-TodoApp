const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
// Post 요청으로 서버에 데이터 전송시 필요!

app.listen(8383, function(){ // 포트 번호 8080, 열리면 하는 기능 적기
    console.log('listening on 8383') // localhost:8080 에 서버 만든거임
});
// 위는 서버 오픈하는 기본 세가지 문법

// 서버에 get 요청하기
// app.get('/pet', function(request, response){
//     response.send('일심 장군이 펫샵에 오셔서 반갑습니다.')
// });
//
// app.get('/beauty', function(request, response){
//     response.send('빛나라의 웰니스 뷰티샵입니다.')
// });

// 0. Control + C 로 터미널창 재실행
// 1. 터미널에 node server.js
// 2. 서버 다시 껏다가 키면 get 요청 처리가 됨

// 콜백함수 : 순차적으로 실행하고 싶을 때 쓰는 함수 안에 함수가 들어가 있는 형태이다.
app.get('/', function(request, response){ // 요청내용, 응답할 방법
    response.sendFile(__dirname + '/index.html')
});

app.get('/checklist', function(request, response){
    response.sendFile(__dirname + '/checklist.html')
});

// 어떤 사람이 /add 경로로 post 요청을 하면 ?? 을 해주세요.
app.post('/add', function(request, response){
    console.log(request.body);
    response.send('전송완료')
//  DB에 저장해주세요~! REST API
});


// Post 요청으로 서버에 데이터 전송하고 싶으면 ?
// 1. body-parse 필요
// 2. from 안의 input 에 구분하기 위한 name 을 꼭 써야함!
// 3. name = "title", name = "date" 와 같이