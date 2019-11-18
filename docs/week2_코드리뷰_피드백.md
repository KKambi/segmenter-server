# week2 19조 김한비 코드리뷰 피드백 개인정리

#### 객체 리터럴의 특징 (함수 및 클래스와 비교)
***특징***
- 객체 리터럴은 new Object()를 통해 인스턴스를 생성하는 걸 간단하게 해 준다.
- 인스턴스를 바로 생성하는 대신, 1개만 만들 수 없다는 점!

***장점***
- 인스턴스를 만드는 구문을 작성하지 않아도 된다.
- 객체 리터럴은 정의함과 동시에 인스턴스가 자동으로 만들어진다.
- 짧다. 가독성이 좋다.
- 속도도 더 빠르다.
- Override를 방지할 수 있다. Object 내장함수조차 재정의될 수 있다.
  ```javascript
  Object = function(){ 
    alert("재정의"); 
  };
  const obj1 = new Object(); //alert 발생
  ```

***단점***
- 여러 개의 인스턴스를 만들 수 없다.

#### 비동기 작업의 병렬 처리
```javascript
for await (variable of iterable) {
  statement
}
```
- creates a loop iterating over async iterable objects

#### for문 안에서 await를 사용할 경우의 속도?
- 병렬이 아닌 순차적으로 처리될 것
- 그만큼 시간이 더 걸린다.

#### 간단한 피드백
- 구현이 되지 않은 부분이라면, 이를 제외하고 리뷰받아야 한다.
- 의미없는 주석처리는 설명을 달아야 한다.
- 기본 String 덧셈보다, 템플릿 리터럴을 사용!
- 사용하지 않는 변수는 제거.
- var / let / const에 항상 신경쓰자.
- 메소드 체이닝을 적극 사용하자.
- Object shorthand를 적극 사용하자.
- 객체 이름이 Signature이므로, createSignature가 아닌 create로 메소드명을 명명.