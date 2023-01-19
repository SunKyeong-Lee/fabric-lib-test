import styled from "styled-components";
import { fabric } from "fabric";
import { useState } from "react";
import { useEffect } from "react";

const FabricTest = () => {
  // 1. 캔버스 id 설정
  // 2. fabric을 저장하고 액세스할 상태 변수 정의
  const [canvas, setCanvas] = useState("");

  // 3. fabric을 반환하는 함수 생성
  const initCanvas = () =>
    new fabric.Canvas("canvasTest", {
      // styles...
      // canvas를 감싼 div(DrawingArea)와 크기가 같아야 함 - 퍼센트 X
      width: 280,
      height: 200,
    });

  // 4. DOM 초기 렌더링 시 함수 호출
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);

  // 기본적으로 제공하는 도형 객체 (fabric.Rect)
  const addRect = () => {
    const rect = new fabric.Rect({
      // styles...
      width: 120,
      height: 80,
      fill: "cornflowerblue",
    });
    canvas.add(rect);
    canvas.centerObject(rect); // 캔버스 중앙 배치
    canvas.setActiveObject(rect); // 불러오자마자 활성화
    canvas.renderAll();
  };

  // 활성화된 객체 삭제
  const handleDelete = () => {
    canvas.remove(canvas.getActiveObject());
  };

  /** 이미지 업로드 */
  const handleImage = (e) => {
    // 업로드한 값이 없다면 캔버스 비우기
    if (!e) {
      canvas.clear();
    }
    // input으로 선택한 파일은 File로 정의되고 FileList에 담긴다.
    // e.target.files : FileList 객체 {0: File, length: 1}
    // FileList 객체는 선택한 파일이 하나라도 배열에 저장되므로 인덱스 지정 > [0]
    const file = e.target.files[0];
    // FileList 안의 File 객체에는 파일 데이터 자체가 숨어있음
    // 이 숨어있는 데이터를 읽기 위해 FileReader API를 사용
    const reader = new FileReader();
    // 파일을 읽을 때 FileReader가 즉시 파일을 읽는 게 아니기 때문에,
    // onload 이벤트 핸들러를 붙여서 콜백으로 파일을 다 읽었다는 것을 알려줘야함
    reader.onload = (e) => {
      const imgObj = new Image();
      imgObj.src = e.target.result; // result : 파일의 내용을 반환 (FileReader API)
      // 이미지가 로드되었을 때, fabric.js로 image 만들기
      imgObj.onload = () => {
        const img = new fabric.Image(imgObj);
        // img.set('flipX', true); // 좌우 반전
        img.scaleToHeight(100);
        img.scaleToWidth(100);
        canvas.centerObject(img);
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      };
    };
    // readAsDataURL() : blob 타입의 file 데이터를 url 형태로 만듬 (FileReader API)
    if (e.target.files[0]) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Wrap>
      <div>
        <img src={require("../img/testImg.jpg")} />
        <DrawingArea>
          <canvas id="canvasTest" /> {/* 1. 캔버스 id 설정 */}
        </DrawingArea>
      </div>

      <ButtonWrap>
        <button onClick={addRect}>사각형</button>
        <button onClick={handleDelete}>삭제</button>
        <label htmlFor="uploadImg">이미지 업로드</label>
        <input
          type="file"
          accept="image/*" // accept : 사용가능한 파일 종류 제한
          id="uploadImg"   // label과 연결하기 위해 같은 이름으로
          onChange={handleImage}
        />
      </ButtonWrap>
    </Wrap>
  );
};

export default FabricTest;

const Wrap = styled.div`
  display: flex;
  margin: 20px;
  gap: 50px;
  img {
    width: 800px;
  }
`;

const DrawingArea = styled.div`
  position: absolute;
  top: 180px;
  left: 290px;
  z-index: 10;
  // 캔버스와 사이즈가 같아야 함
  width: 280px;
  height: 200px;
  // 캔버스 작업 영역을 확인하기 위한 outline
  &:hover {
    outline: 1px dashed black;
  }
`;

const ButtonWrap = styled.div`
  button,
  label {
    display: block;
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: none;
    background-color: black;
    color: whitesmoke;
    cursor: pointer;
    font-size: 1rem;
  }
  input {
    display: none;
  }
`;
