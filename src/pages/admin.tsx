import { FormLabel, FormControl, Input, Button } from '@chakra-ui/react';

export default function Admin() {
  return (
    <form>
      <FormControl>
        <FormLabel htmlFor="name">Username</FormLabel>
        <Input id="username" placeholder="username" />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="name">Password</FormLabel>
        <Input id="password" placeholder="password" />
      </FormControl>
      <Button mt={4} colorScheme="teal" type="submit">
        Submit
      </Button>
    </form>
  );
}
