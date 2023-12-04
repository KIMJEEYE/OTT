## OTT Service

1. 영화 정보 관리  
: 영화 제목, 장르, 감독, 출연자 등의 영화 정보를 데이터 베이스 저장 및 관리
OTT에 등록된 장르를 목록으로 조회: GET movie/genre
OTT에 등록된 장르의 수 조회: GET movie/genre/count
OTT에 장르 등록: POST movie/genre
OTT 장르 수정(장르번호 이용): PUT moive/genre/{genre_num}
OTT 장르 삭제( 장르 번호 이용): PUT moive/genre/{genre_num}
특정 장르에 속한 영화 목록 조회: GET moive/genres/{genre_num}/movies
특정 장르에 새로운 영화 등록:POST moive/genres/{genre_num}/movies
특정 장르의 특정 영화 정보 수정: PUT moive/genres/{genre_num}/movies/{movie_num}
특정 장르의 특정 영화 삭제: DELETE movie/genres/{genre_num}/movies/{movie_num}
특정 장르의 특정 영화 상세 조회: GET moive/genres/{genre_num}/movies/{movie_num}

2. 콘텐츠 관리
: 콘텐츠 유효 기간 관리, 콘텐츠 업로드, 메타데이터 관리
콘텐츠 유효기간 조회: GET contents/{content_id}/validity
콘텐츠 유호 기간 설정: PUT contents/{content_id}/validity
새로운 콘텐츠 업로드: POST contents
특정 콘텐츠 메타데이터 조회: GET contents/{content_id}/metadata
특정 콘텐츠 메타데이터 수정: PUT contents/{content_id}/metadata

3. 결제 처리
: 선택한 결제 방법을 결제할 수 있는 결제 게이트웨이 통합, 여러가지 옵션(신용카드, 페이팔, 계좌이체 등), 월결제 혹은 연결제 선택 가능
사용자의 결제 방법 목록 조회: GET payments/methods
사용자의 새 결제 방법 등록: POST payments/methods
사용자의 특정 결제 방법 수정: PUT  payments/methods/{methods_id}
사용자의 특정 결제 방법 삭제: DELETE payments/methods/{methods_id}
월 결제 혹은 연결제 선택 위한 옵션 설정: PUT payments/users/{user_id}/subscription
사용자가 선택한 구독 옵션 확인: GET payments/users/{user_id}/subscription
사용자의 구독 옵션 선택 및 수정: PUT payments/sers/{user_id}/subscription
결제 진행: POST payments/execute
결제 요청: POST payments/request
결제 승인: POST payments/approve

4. 결제 확인 취소
: 사용자가 결제 확인하고 필요한 경우, 취소 가능해야 함, 결제 취소시 환불 정책 사용
결제 승인 결과 확인: GET payments/{payments_id}/status
결제 취소: POST payments/{payments_id}/cancel
환불 요청: POST refunds
결제 상태 수정: PUT payments
환불 상태 조회: GET refunds/{refund_code}

5. 제작사 관리
: 콘텐츠 제작사 정보 저장, 관리하는 기능(제작사 정보, 연락처, 작품 목록 및 제휴 협상 등)
제작사 목록 조회: GET manufacturers
특정 제작사 정보 조회: GET manufacturers/{manufacturer_id}
새로운 제작사 등록: POST manufacturers
특정 제작사 정보 수정: PUT manufacturers/{manufacturer_id}
특정 제작사 삭제: DELETE manufacturers/{manufacturer_id}

6. 할인 관리
: 제휴 할인 등 결제 시 확인할 수 있게 함(추후에 좀 비면 동적 할인 적용 및 프로모션 지원하는 기능도 여기에 추가하면 좋을 듯) 
할인 정보 조회: GET discounts
특정 할인 정보 조회: GET discounts/{discount_id}
새로운 할인 등록: POST discounts
특정 할인 정보 수정: PUT discounts/{discount_id}
특정 할인 삭제: DELETE discounts/{discount_id}

7. 쿠폰 발급
생성된 쿠폰에 대한 발급 내역 조회: GET coupons/{coupon_id}/issues
쿠폰 생성: POST coupons/{coupon_id}/issues
사용자에게 발급된 쿠폰 목록 조회: GET users/{user_id}/coupons
회원에게 발급된 쿠폰의 개수 조회: GET users/{user_id}/coupons/count
회원에게 발급된 쿠폰 삭제: DELETE users/{user_id}/coupons/{coupon_id}

7. 리뷰 관리
: 별 관리, 나라별 탑 10 저장, 사용자에 맞게 자동추천해줌
-가입한 회원들 수 조회: get customersprivacy/count
-사용자 선호 목록 자동 진열: get autodisplay
-사용자 선호 목록 수정: put autodisplay/{display_no}
-사용자 선호 목록 삭제: delete autodisplay/{display_no}

8. 회원 관리
: 사용자 계정 생성 및 관리(결제 내역 확인, 사용자 프로필 관리, 시청기록 등)
-회원 검색(서버 자원 요청) get  customers
-회원결제 수단 내역 조회(서버 자원 요청)get customers/{member_id}/paymentinformation
-회원 결제수단 내역 삭제 delete customers/{member_id}/paymentinformation

9. 다른 IO 장비 연결 관리
: TV,혹은 빔 프로젝트 등에 연결하게 해줌

10. 인증 관리
: 성인 및 15세 이상 을 인증
-회원아이디,이름 휴대전화, 나이 등 조회 get customersprivacy

11. 관리자 대시 보드
: 관리자는 영화 정보, 상영 일정, 예매 내역 등을 관리할 수 있는 대시보드 사용, 시청 
통계 및 매출 정보 시각화하여 제공
-pc 혹은 모바일에서 전체 정보 목록 조회: get themes


12. 보안 관리
: 사용자 데이터와 결제 정보를 안전하게 관리하고 보호하기 위한 보안 조치 적용 SQL 인젝션, 크로스사이트 스크립팅 등의 보안 취약점 방지
