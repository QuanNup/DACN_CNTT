import React from 'react';
import styled from 'styled-components';

const ButtonUpload = ({ title, onClick, uploadStatus }: { title: string, onClick?: () => void, uploadStatus?: string }) => {
    return (
        <StyledWrapper uploadStatus={uploadStatus}>
            <button className="button" onClick={onClick}>
                <svg xmlns="http://www.w3.org/2000/svg">
                    <rect className="border" pathLength={100} />
                    <>
                        <rect className="loading" pathLength={100} />
                        <svg className="done-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path className="done done-cloud" pathLength={100} d="M 6.5,20 Q 4.22,20 2.61,18.43 1,16.85 1,14.58 1,12.63 2.17,11.1 3.35,9.57 5.25,9.15 5.88,6.85 7.75,5.43 9.63,4 12,4 14.93,4 16.96,6.04 19,8.07 19,11 q 1.73,0.2 2.86,1.5 1.14,1.28 1.14,3 0,1.88 -1.31,3.19 Q 20.38,20 18.5,20 Z" />
                            <path className="done done-check" pathLength={100} d="M 7.515,12.74 10.34143,15.563569 15.275,10.625" />
                            <path className="done done-cross" pathLength={100} d="M 8,8 L 16,16 M 16,8 L 8,16" />
                        </svg>
                    </>
                </svg>
                <div className="txt-upload">{title}</div>
            </button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div<{ uploadStatus?: string }>`
    .button {
        position: relative;
        width: 10rem;
        height: 3rem;
        cursor: pointer;
        border: none;
        background: none;
    }

    .button svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    .border {
        width: 100%;
        height: 100%;
        stroke: black;
        stroke-width: 2px;
        fill: #0000;
        rx: 1em;
        ry: 1em;
        stroke-dasharray: 25;
        transition: fill 0.25s;
        animation: 4s linear infinite stroke-animation;
    }

    .button:hover .border {
        fill: #0001;
    }

    @keyframes stroke-animation {
        0% {
        stroke-dashoffset: 100;
        }
        to {
        stroke-dashoffset: 0;
        }
    }

    .txt-upload {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .txt-upload::after {
        content: "";
    }

    @keyframes anim2 {
        0% {
        content: "";
        }
        33% {
        content: ".";
        }
        66% {
        content: "..";
        }
        to {
        content: "...";
        }
    }

    .loading {
        width: 100%;
        height: 100%;
        stroke: #000;
        stroke-width: 2px;
        fill: none;
        rx: 1em;
        ry: 1em;
        stroke-dasharray: 0 100;
    }

    .done {
        fill: none;
        stroke: #000;
        stroke-dasharray: 0 100;
    }
    ${({ uploadStatus }) => uploadStatus === 'success' && `
        .border{
            transition: fill 0.25s 2.75s;
            fill: #0000;
        }

        .border{
            stroke: #0000;
        }
        .rect{
            stroke-dasharray: 50;

        }
        .txt-upload{
            opacity: 0;
            transition: opacity 0.25s 3s;
        }

        .txt-upload::after{
            animation: 0.66666s anim step-end forwards,
            1.33333s 0.6666s anim2 linear infinite alternate;
        }
        .loading {
            transition: stroke 0.5s 2.5s, stroke-dasharray 3s 0.5s ease-out;
            stroke: #08ca08;
            stroke-dasharray: 100 0;
        }
            .done-cloud {
            transition: stroke-dasharray 0.75s 3.5s ease-out;
            stroke-dasharray: 100 0;
        }
        .done-check {
            transition: stroke-dasharray 0.5s 4.2s ease-out;
            stroke: #08ca08;
            stroke-dasharray: 100 0;
        }
    `}
    ${({ uploadStatus }) => uploadStatus === 'error' && `
    .border{
        transition: fill 0.25s 2.75s;
        fill: #0000;
    }

    .border{
        stroke: #0000;
    }
    .rect{
        stroke-dasharray: 50;

    }
    .txt-upload{
        opacity: 0;
        transition: opacity 0.25s 3s;
    }

    .txt-upload::after{
        animation: 0.66666s anim step-end forwards,
        1.33333s 0.6666s anim2 linear infinite alternate;
    }
     .loading {
        transition: stroke 0.5s 2.5s, stroke-dasharray 3s 0.5s ease-out;
        stroke: #FF0000;
        stroke-dasharray: 100 0;
    }
    .done-cloud {
        transition: stroke-dasharray 0.75s 3.5s ease-out;
        stroke-dasharray: 100 0;
    }
    .done-cross {
        transition: stroke-dasharray 0.5s 4.2s ease-out;
        stroke: #FF0000;
        stroke-dasharray: 100 0;
    }
    `}
   
`;

export default ButtonUpload;
