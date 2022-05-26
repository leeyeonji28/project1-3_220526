DROP DATABASE IF EXISTS project1_3_220526;
CREATE DATABASE project1_3_220526;
USE project1_3_220526;

# 테이블 생성
CREATE TABLE wise_saying(
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    regDate DATETIME NOT NULL,
    content VARCHAR(200) NOT NULL,
    author VARCHAR(50) NOT NULL,
    hitCount INT UNSIGNED NOT NULL DEFAULT 0,
    goodLikeCount INT UNSIGNED NOT NULL DEFAULT 0,
    badLikeCount INT UNSIGNED NOT NULL DEFAULT 0
);

DESC wise_saying;

# 데이터 생성
INSERT INTO wise_saying
SET regDate = NOW(),
`content` = "나 자신에 대한 자신감을 잃으면 온 세상이 나의 적이 된다.",
author = "랄프 왈도 에머슨";

INSERT INTO wise_saying
SET regDate = NOW(),
`content` = "항상 맑으면 사막이 된다. 비가 내리고 바람이 불어야만 비옥한 땅이 된다.",
author = "스페인 속담";

INSERT INTO wise_saying
SET regDate = NOW(),
`content` = "인생에서 가장 슬픈 세 가지. 할 수 있었는데, 해야 했는데, 해야만 했는데.",
author = "루이스 E. 분";

# 전체 조회
SELECT *
FROM wise_saying;