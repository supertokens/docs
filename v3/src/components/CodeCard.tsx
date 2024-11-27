
import {Flex, Box, Card, Separator, Select } from "@radix-ui/themes";


/**
 * Used to render code blocks that have a selection step (package manager type, language framework)
 * Not sure if it's the best abstraction since you could also include an additional 
 * select component inside the flex header
 */
export function CodeCardRoot({ options } ) {


  return (

  <Card style={{ padding: "0"}}>
  <Flex gap="2" direction="row" pt="3" pb="3" px="3">
      <Select.Root defaultValue="npm7">
<Select.Trigger />
	<Select.Content>
          	<Select.Item value="npm7">NPM>=7</Select.Item>
            <Select.Item value="npm6">NPM>=6</Select.Item>
            <Select.Item value="yarn">Yarn</Select.Item>
          </Select.Content>
        </Select.Root>
  </Flex>
  <Separator size="4" />




</Card>
  )
}



