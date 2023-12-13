
const models = require('./models/index');
const Movie = require('./models/Movie');
const Coupon = require('./models/Coupon');
const Genre = require('./models/Genre');
const MovieGenre = require('./models/MovieGenre');
const User = require('./models/User');
const ProdnCo = require('./models/ProdnCo');
const ProdnCoMovies = require('./models/ProdnCoMovies');

const couponData = [
    {
        name: 'Coupon 1',
        discountRate: 10,
        discountPeriod: new Date('2022-12-31'),
    },
    {
        name: 'Coupon 2',
        discountRate: 20,
        discountPeriod: new Date('2022-12-31'),
    },
];

(async () => {
    try {
        await Coupon.syncModel();
        await Coupon.bulkCreate(couponData);
        console.log('Data inserted successfully!');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
})();

const movieData = {
    title: '영화 제목',
    director: '감독 이름',
    year: 2023,
    synopsis: '영화 내용',
    rating: 4.5
};

Movie.create(movieData)
    .then(movie => {
        console.log('영화가 성공적으로 추가되었습니다:', movie);
    })
    .catch(error => {
        console.error('영화 추가 중 에러 발생:', error);
    });

const genreData = {
    name: '모험'
};

const movieGenreData = {
    movieId: 1,
    name: '모험'
};

Genre.create(genreData)
    .then(genre => {
        console.log('장르가 성공적으로 추가되었습니다:', genre);
    })
    .catch(error => {
        console.error('장르 추가 중 에러 발생:', error);
    });

MovieGenre.create(movieGenreData)
    .then(movieGenre => {
        console.log('영화 장르가 성공적으로 추가되었습니다:', movieGenre);
    })
    .catch(error => {
        console.error('영화 장르 추가 중 에러 발생:', error);
    });

const bcrypt = require('bcrypt');

const saltRounds = 12;
const user = {
    userId: "admin",
    password: "admin",
    username: "관리자",
    email: "admin@admin",
    dateOfBirth: "2021-01-01",
    phoneNumber: "010-0000-0000"
};
// 비밀번호 해시화
bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) {
        console.error('비밀번호 해시 중 에러 발생:', err);
    } else {
        // 해시된 비밀번호를 user 객체에 설정
        user.password = hash;

        // User 모델을 사용하여 사용자 추가
        User.create(user)
            .then(user => {
                console.log('사용자가 성공적으로 추가되었습니다:', user);
            })
            .catch(error => {
                console.error('사용자 추가 중 에러 발생:', error);
            });
    }
});

const prodnCoData = {
    name: '제작사 이름',
    ceo:"대표자 이름",
    homepage:"홈페이지 주소"
};

ProdnCo.create(prodnCoData)
    .then(prodnCo => {
        console.log('제작사가 성공적으로 추가되었습니다:', prodnCo);
    })
    .catch(error => {
        console.error('제작사 추가 중 에러 발생:', error);
    });

const prodnCoMoviesData = {
    prodncoId: 1,
    movieId: 1
};

ProdnCoMovies.create(prodnCoMoviesData)
    .then(prodnCoMovies => {
        console.log('제작사 영화가 성공적으로 추가되었습니다:', prodnCoMovies);
    })
    .catch(error => {
        console.error('제작사 영화 추가 중 에러 발생:', error);
    });