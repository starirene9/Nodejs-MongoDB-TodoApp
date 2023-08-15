const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
// Post 요청으로 서버에 데이터 전송시 필요!

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb+srv://starirene9:gzKhvuSABTyfrIus@cluster0.cexbyak.mongodb.net/todoapp?retryWrites=true&w=majority';

MongoClient.connect(url, {useUnifiedTopology: true}, (error, client) => {
    // database 접속이 완료되면 할 일
    if (error) return console.log(error)

    const db = client.db('todoapp'); // todoapp이라는 Database 에 연결해 줌

    // db.collection('post').insertOne() 이 형태 기억할 것~!
    db.collection('post').insertOne({이름: 'Bitna', _id : 100}, (insertError, result) => {
        if (insertError) {
            console.error('저장 실패:', insertError);
        } else {
            console.log('저장 완료', result.insertedId);
        }

        app.listen(8080, () => { // 포트 번호 8080, 열리면 하는 기능 적기
            console.log('listening on 8080') // localhost:8080 에 서버 만든거임
        });
    });
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
app.get('/', function (request, response) { // 요청내용, 응답할 방법
    response.sendFile(__dirname + '/index.html')
});

app.get('/checklist', function (request, response) {
    response.sendFile(__dirname + '/checklist.html')
}); // 이것이 API 이다.

// 어떤 사람이 /add 경로로 post 요청을 하면 ?? 을 해주세요.
app.post('/add', function (request, response) {
    console.log(request.body);
    response.send('전송완료')
//  DB에 저장해주세요~! REST API
});


// Post 요청으로 서버에 데이터 전송하고 싶으면 ?
// 1. body-parse 필요
// 2. from 안의 input 에 구분하기 위한 name 을 꼭 써야함!
// 3. name = "title", name = "date" 와 같이
//
// 서버를 REST API 하게 만들자
// API란 무엇인가? Application Programming Interface : 서버간의 통신 규약
// 웹 개발시 API란? 웹서버와 고객간의 소통방식 : 통신 규약
//
// REST API 원칙 6개
// GET, POST, PUT, DELETE 를 REST 원칙에 의해서 쓰자
// 1. Uniform interface : 하나의 자료는 하나의 URL로
// 2. Client-Server 역할 구분 : 브라우저는 요청만 할 뿐, 서버는 응답만
// 3. Stateless : 요청1과 요청2는 독립적으로 의존성이 없어야 함
// 4. Cacheable : 캐싱이 가능해야 함 <- 크롬이 알아서 함
// 5. Layered System
// 6. Code on Demand

// 좋은 REST API
// 1. URL 을 명사로 작성하기
// 2. 하위 문서는 /
// 3. 띄어쓰기는 대시 - 이용