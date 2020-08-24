import React from 'react'
import { css } from "@emotion/core"
import { PacmanLoader } from 'react-spinners'

const override = css`
  display: inline-block;
  margin: 0 50px 0 0;
  animation-name: pacman;
  animation-duration: 2s;
`

export default function PacmanSpinner(props) {
  return (
    <div style={{ textAlign: 'center', position: 'relative', top: '100px' }}>
      <PacmanLoader
        css={override}
        size={50}
        color="purple"
        loading={props.loading}
      />
    </div>
  )
}