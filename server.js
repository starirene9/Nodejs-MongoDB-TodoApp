const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // Post 요청으로 서버에 데이터 전송시 필요!
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs'); // ejs 설치후 이것 까지 써줘야함
app.use('/public', express.static('public'));
// 미들웨어라고 불리며 css 파일 넣기에 사용
// public/main.css 생성 -> server.js에 위의 코드 추가

// Post 요청으로 서버에 데이터 전송하고 싶으면 ?
// 1. body-parse 필요
// 2. from 안의 input 에 구분하기 위한 name 을 꼭 써야함! name = "title", name = "date" 와 같이


const url = 'mongodb+srv://starirene9:gzKhvuSABTyfrIus@cluster0.cexbyak.mongodb.net/todoapp?retryWrites=true&w=majority';

var db;
MongoClient.connect(url, {useUnifiedTopology: true}, function (error, client) {
    // database 접속이 완료되면 할 일
    if (error) return console.log(error);
    db = client.db('todoapp'); // todoapp이라는 Database 에 연결해 줌

    // 형태 기억! 데이터 저장 단계 : 몽고디비는 schema 신경쓰지 않아도 됨
    // db 에 post 라는 파일이 있으면 ~
    // db.collection('post').insertOne( '저장할 데이터', function(에러, 결과) {
    //      console.log('저장완료');
    // 데이터 저장 형식 무조건 아래 object 형태로 저장해야 함
    // db.collection('post').insertOne({이름: 'Bitna', _id: 100}, function (insertError, result) {
    //     console.log('저장완료');
    // });

    app.listen(8080, function () { // 포트 번호 8080, 열리면 하는 기능 적기
        console.log('listening on 8080') // localhost:8080 에 서버 만든거임
    });
});


// 서버에 get 요청하기
// app.get('/pet', function(request, response){
//     response.send('일심 장군이 펫샵에 오셔서 반갑습니다.')
// });
//
// app.get('/beauty', function(request, response){
//     response.send('빛나라의 웰니스 뷰티샵입니다.')
// });

// 콜백함수 : 순차적으로 실행하고 싶을 때 쓰는 함수 안에 함수가 들어가 있는 형태이다.
app.get('/', function (request, response) { // 요청내용, 응답할 방법
    response.render('index.ejs')
});
// /를 요청하면 응답으로 index.html을 보여주는데 파일 형태를 보여준다.

app.get('/checklist', function (request, response) {
    response.render('checklist.ejs')
});


// 1. 어떤 사람이 /add 라는 경로로 post 요청을 하면,
// 2. 데이터 2개 (날짜(date), 제목(title)을 보내주는데,
// 이때 'post'라는 이름을 가진 collection에 두 개 데이터를 저장하기

// 누가 ' 폼 ' (이니까 post) 에서 /add로 post 요청하면 일어나는 일들~
app.post('/add', function (request, response) {
    response.send('/add post 전송완료');   // respond with this message
    // console.log(request.body.title);
    // console.log(request.body.date);
    // create database + 에서 counter 이라는 db 추가함
    // db counter 에서 findone 할건데 {name : '게시물갯수'} 인 데이터를 찾아주세요
    db.collection('counter').findOne({name: '게시물갯수'}, function (error, result) {
        console.log(result);
        var totalCount = result.totalPost; // 변수를 활용하면 됨

        // _id : 총개시물 갯수 + 1 <- autoincrement 기능을 몽고db는 직접 만들어야함 : 글마다 고유의 아이디를 갖는게 중요
        // db안에 post를 가지고 오세요 insertOne 할 건데 이걸루..
        db.collection('post').insertOne({
            _id: totalCount + 1,
            제목: request.body.title,
            날짜: request.body.date
        }, function (error, result) {
            console.log('저장완료');

            // Counter의 totalPost 도 1 증가 시켜야함
            //  updateOne({어떤 데이터를 수정할지},{수정값 $set/ $inc 등과 같은 operator(연산자) 필요!: {totalPost : 바꿀값}},function(){} )하나
            //  updateMany 는 여러개
            db.collection('counter').updateOne({name: '게시물갯수'}, {$inc: {totalPost:1}}, function (error, result) {
                // {$inc : {totalPost : 기존값에 더해줄 값}}
                if (error) {
                    return console.log(error)}
                response.send('전송완료');
            })
        });

    });
}); // db 가서 id가 잘 icrement 하고 post에 글 잘 올라가 있는지 확인하면 됨

// list 로 GET 요청으로 접속하면 HTML을 보여줌
// (/list get 요청, list에 ejs, db의 post에서 모든것 뿌려주기)
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML 보여주기
app.get('/list', function (request, response) {
    // 1. 데이터 꺼내는게 먼저
    // db.collection('저장소이름').find().toArray(); 여기까지가 다 찾아주세요
    db.collection('post').find().toArray(function (error, result) { // 순서를 잘 지켜줘야함
        console.log(result) // 모든 데이터 가져오기 문법

        // 2. 보여주는게 후순위 : 뿌려주기 즉 렌더링해주기
        response.render('list.ejs', {results: result}); // object 형태로 넣어줘야 함
    });

});

app.delete('/delete', function (request, response) {
    console.log(request.body); // ''있는 문자형태임 _id: '1'
    // 요청.body에 담긴 게시물 번호에 따라 db에서 게시물 삭제하면 됨
    request.body._id = parseInt(request.body._id); // 숫자로 전환 후에 다시 담기
    db.collection('post').deleteOne(request.body, function(error, result){
        console.log('삭제완료');
        response.status(200).send({ message : '성공했습니다.'}); // 응답코드로 서버가 요청 실패 성공 등 안내메세지를 띄움
    // 200 성공, 400 실패 터미널 콘솔 : 서버가 이런 안내 메세지를 띄워 주는 것도 매우 중요하다.

    })
})

// detail2로 접속하면 deatail2.ejs 보여줌 => '/detail/:id'
app.get('/detail/:id', function(request, response){
    // detail/뒤에 있는 숫자를 넣어주세요. => request.params.id <- mouse를 가져가면 string임
    // id string -> int 로 바꾸기

    db.collection('post').findOne({_id : parseInt(request.params.id)}, function(error, result){
        console.log(result); // 콘솔창에 띄워짐

        if(error){
            console.error('Error fetching post :', error);
            response.status(500).send({mesage : 'Internal server error'});
            return;
        }

        if(!result){
            response.render('error.ejs', { errorMessage: 'Post not found' }); // Render the error page
            return;
        }

        console.log(result); // Debugging, you can remove this

        response.render('detail.ejs', {data : result})
    })
})




// response.send response.render response.status(200).send({message : 'message'}}





// 서버를 REST API 하게 만들자
// API란 무엇인가? Application Programming Interface : 서버간의 통신 규약
// 웹 개발시 API란? 웹서버와 고객간의 소통방식 : 통신 규약

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

// 0. Control + C 로 터미널창 재실행
// 1. 터미널에 node server.js
// 2. 서버 다시 껏다가 키면 get 요청 처리가 됨