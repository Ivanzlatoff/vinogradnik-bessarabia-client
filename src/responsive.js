import { css } from 'styled-components';

export const mobile = (props) => {
    return css`
        @media only screen and (max-width: 420px) {
            ${props}
        }
    `;
};

export const mobileLarge = (props) => {
    return css`
        @media only screen and (max-width: 600px) {
            ${props}
        }
    `;
};

export const tabletSmall = (props) => {
    return css`
        @media only screen and (max-width: 800px){
            ${props}
        }
    `
}

export const tabletMiddle = (props) => {
    return css`
        @media only screen and (max-width: 1000px){
            ${props}
        }
    `
}

export const tablet = (props) => {
    return css`
        @media only screen and (max-width: 1250px){
            ${props}
        }
    `
}

export const tabletLarge = (props) => {
    return css`
        @media only screen and (max-width: 1400px){
            ${props}
        }
    `
}
