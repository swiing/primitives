import React, {Fragment, FC} from 'react'
import {Box} from '@primer/components'
import Table from '@primer/gatsby-theme-doctocat/src/components/table.js'
import TokenTable from '../TokenTable'
import TokenInlineCode from '../TokenInlineCode'
import FrameworkVariableTable from './FrameworkVariableTable'
import tokens from '../../../../dist/docs/docValues.json'
import ControlVisual from '../control'

interface UIControlTableProps {
  filePath?: string
  tokenVariant?: string
}

const UIControlTable: FC<UIControlTableProps> = ({filePath, tokenVariant}) => {
  return (
    <Box as="div" sx={{overflow: 'auto'}}>
      <TokenTable>
        <Fragment>
          <thead>
            <tr>
              <Box as="th" textAlign="left">
                Example
              </Box>
              <Box as="th" textAlign="left">
                Token
              </Box>
              <Box as="th" textAlign="left">
                Value
              </Box>
              <Box as="th" textAlign="left">
                px
              </Box>
            </tr>
          </thead>
          <tbody>
            {tokens[filePath].map(token => {
              const gapProp = token.name.includes('gap') ? true : false
              const paddingLeft = token.name.includes('paddingInline') ? true : false
              const paddingRight = token.name.includes('paddingInline') ? true : false
              const paddingTop = token.name.includes('paddingBlock') ? true : false
              const paddingBottom = token.name.includes('paddingBlock') ? true : false
              const lineBlockHeightProp = token.name.includes('lineBoxHeight') ? true : false
              const blockSize = token.name.includes('size') ? true : false
              const condensed = token.name.includes('condensed') ? true : false
              const normal = token.name.includes('normal') ? true : false
              const spacious = token.name.includes('spacious') ? true : false
              const tokenVariantString = tokenVariant.replace(/-/g, '')
              const FrameworkVars = [
                {id: 'CSS', token: `--${token.name}`},
                {id: 'JS', token: `${token.path.join('.')}`}
              ]
              console.log(tokenVariantString, paddingLeft)
              return (
                token.name.includes('-control-') &&
                token.name.match(tokenVariant) && (
                  <tr>
                    <td>
                      <ControlVisual
                        gap={tokenVariantString}
                        paddingLeft={tokenVariantString}
                        paddingRight={tokenVariantString}
                        paddingTop={tokenVariantString}
                        paddingBottom={tokenVariantString}
                        blockSize={tokenVariantString}
                        lineBox={tokenVariantString}
                        modifier={condensed ? '-condensed' : normal ? '-normal' : spacious ? '-spacious' : '-normal'}
                        highlightPaddingBottom={paddingBottom}
                        highlightPaddingTop={paddingTop}
                        highlightPaddingRight={paddingRight}
                        highlightPaddingLeft={paddingLeft}
                        highlightGap={gapProp}
                        highlightHeight={blockSize}
                        highlightLineBoxHeight={lineBlockHeightProp}
                      />
                    </td>
                    <FrameworkVariableTable frameworks={FrameworkVars} />
                    <td>
                      <TokenInlineCode>{token.value}</TokenInlineCode>
                    </td>
                    <td>
                      <TokenInlineCode>{token.original.value}</TokenInlineCode>
                    </td>
                  </tr>
                )
              )
            })}
          </tbody>
        </Fragment>
      </TokenTable>
    </Box>
  )
}

export default UIControlTable
