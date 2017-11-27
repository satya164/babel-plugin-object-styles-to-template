const title = css`
  &:hover {
    color: ${`blue`};
  }

  section {
    font-size: 20px;
  }

  ${test} {
    font-size: 3em;
  }

  @keyframes bounce {
    0% {
      transform: scale(1.01);
    }

    100% {
      transform: scale(0.99);
    }
  }
`;
