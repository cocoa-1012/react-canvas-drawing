import React from "react";
import styled from "styled-components";
export const Button = ({ title, submit, type }) => {
  return (
    <ButtonComponent onClick={submit} type={type}>
      {title}
    </ButtonComponent>
  );
};

const ButtonComponent = styled.button`
  display: inline-block;
  font-size: 16px;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: ${(props) => (props.type ? "red" : "green")};
  color: white;
  border: 2px solid white;
`;
