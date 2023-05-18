import React from 'react'
import Avatar, { AvatarProps } from '@mui/material/Avatar'
import * as colors from '@mui/material/colors'

const colorsArray: string[] = []
for (const key in colors) colorsArray.push(colors[key][500])

function stringToColor (string: string) {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  hash = (hash * 9301 + 49297)
  return colorsArray[Math.abs(hash % colorsArray.length)]
}

const AvatarComp: React.FC<AvatarProps & { alt: string, src?: string }> = props => props.src
  ? <Avatar {...props} sx={{ ...props.sx, width: 38, height: 38 }} />
  : (<Avatar {...props} sx={{ ...props.sx, bgcolor: stringToColor(props.alt || ''), width: 38, height: 38 }}>
    {(props.alt || '').split(' ')[0][0]}{((props.alt || '').split(' ')[1] || '')[0]}
  </Avatar>)

export default AvatarComp
