import { fabric } from "fabric";
import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { Button } from "./components/Button.jsx";
var canvas = null;
var type = "";
let isDrawing = false;
let origX = 0,
  origY = 0;

function App() {
  const [types, setTypes] = useState("");

  const onRemoveSelected = () => {
    canvas.getActiveObjects().forEach((obj) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject().renderAll();
  };

  const onRemoveAll = () => {
    canvas.getObjects().forEach((obj) => {
      canvas.remove(obj);
    });
    canvas.discardActiveObject().renderAll();
  };

  const onAddCircle = () => {
    type = "circle";
    setTypes("circle");
  };

  const onAddRectangle = () => {
    type = "rect";
    setTypes("rect");
  };

  const onZoomIn = () => {
    const obj = canvas.getActiveObject();
    obj.set({ scaleX: obj.scaleX * 1.2, scaleY: obj.scaleY * 1.2 });
    canvas.renderAll();
  };

  const onZoomOut = () => {
    const obj = canvas.getActiveObject();
    obj.set({ scaleX: obj.scaleX * 0.75, scaleY: obj.scaleY * 0.75 });
    canvas.renderAll();
  };

  const onFitScreen = () => {
    const obj = canvas.getActiveObject();
    obj.set({ left: 0 });
    obj.set({ top: 0 });
    console.log("adfas", canvas.getWidth(), canvas.getHeight());
    if (type === "rect") {
      console.log("adfas", canvas.getWidth(), canvas.getHeight());

      obj.set({ width: canvas.getWidth() });
      obj.set({ height: canvas.getHeight() });
    } else if (type === "circle") {
      console.log("adfas", canvas.getWidth(), canvas.getHeight());

      obj.set({
        radius: Math.min(width, height) / 2,
      });
    }

    obj.setCoords();
    canvas.renderAll();
  };
  useEffect(() => {
    if (canvas === null) {
      canvas = new fabric.Canvas("canvas", {
        width: 1000,
        height: 800,
        backgroundColor: "white",
      });
    }

    canvas.on("mouse:down", function (o) {
      console.log("down");
      type !== "" ? (isDrawing = true) : console.log("type=null");
      var pointer = canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      console.log("type", type);
      if (type === "rect") {
        var rect = new fabric.Rect({
          left: origX,
          top: origY,
          originX: "left",
          originY: "top",
          width: pointer.x - origX,
          height: pointer.y - origY,
          angle: 0,
          transparentCorners: false,
          hasBorders: false,
          hasControls: false,
        });

        canvas.add(rect).setActiveObject(rect);
      } else if (type === "circle") {
        var circle = new fabric.Circle({
          left: origX,
          top: origY,
          originX: "left",
          originY: "top",
          radius: Math.min(pointer.x - origX, pointer.y - origY) / 2,
          angle: 0,
          transparentCorners: false,
          hasBorders: false,
          hasControls: false,
        });

        canvas.add(circle).setActiveObject(circle);
      }
    });
    canvas.on("mouse:move", function (o) {
      if (!isDrawing) return;
      var pointer = canvas.getPointer(o.e);
      var activeObj = canvas.getActiveObject();
      activeObj.fill = "pink";

      if (origX > pointer.x) {
        activeObj.set({ left: Math.abs(pointer.x) });
      }
      if (origY > pointer.y) {
        activeObj.set({ top: Math.abs(pointer.y) });
      }

      if (type === "rect") {
        activeObj.set({ width: Math.abs(origX - pointer.x) });
        activeObj.set({ height: Math.abs(origY - pointer.y) });
      } else if (type === "circle") {
        activeObj.set({
          radius: Math.min(pointer.x - origX, pointer.y - origY) / 2,
        });
      }

      activeObj.setCoords();
      canvas.renderAll();
    });
    canvas.on("mouse:up", function (o) {
      if (isDrawing) {
        var activeObj = canvas.getActiveObject();
        // remove when less than 10px
        if (type === "rect") {
          if (activeObj.width < 10 && activeObj.height < 10) {
            canvas.remove(activeObj);
            canvas.discardActiveObject().renderAll();
          }
        }
        if (type === "circle") {
          if (activeObj.radius < 10) {
            canvas.remove(activeObj);
            canvas.discardActiveObject().renderAll();
          }
        }
        activeObj.set({
          selectable: true,
          evented: true,
          transparentCorners: true,
          hasBorders: true,
          hasControls: true,
        });
        canvas.renderAll();
      }
      isDrawing = false;
      setTypes("");
      type = "";
    });
    canvas.on("object:moving", function (o) {
      console.log("down");
      isDrawing = false;
      // disable();
    });
  }, []);

  return (
    <div className="App">
      <canvas id="canvas" width="1000px" height="800px"></canvas>
      <div id="controls">
        <ButtonDiv>
          <Button
            title="Remove selected"
            submit={onRemoveSelected}
            type={false}
          />
          <Button title="Remove All" submit={onRemoveAll} type={false} />
          <Button
            title="Submit"
            submit={() => console.log("submit")}
            type={false}
          />
        </ButtonDiv>
        <ButtonDiv>
          <Button
            title="Draw Rectangle"
            submit={onAddRectangle}
            type={types == "rect" ? true : false}
          />
          <Button
            title="Draw Circle"
            submit={onAddCircle}
            type={types == "circle" ? true : false}
          />
        </ButtonDiv>
        <ButtonDiv>
          <Button title="Zoom In" submit={onZoomIn} type={false} />
          <Button title="Zoom Out" submit={onZoomOut} type={false} />
          <Button title="Fit to Screen" submit={onFitScreen} type={false} />
        </ButtonDiv>
      </div>
    </div>
  );
}

export default App;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
  background: transparent;
  color: white;
  padding: 20px;
`;

const CanvasDiv = styled.canvas`
  display: flex;
  flex-direction: column;
  background: white;
  height: 100vh;
  width: 70%;
  color: white;
  padding: 20px;
`;
