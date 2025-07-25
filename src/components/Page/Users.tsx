import { Box, Table } from "@chakra-ui/react";
import type { UserData } from "@/hooks/ws/types";
import { LuCrown } from "react-icons/lu";

interface UsersProps {
    users: UserData[] | undefined
}

export const Users: React.FC<UsersProps> = ({ users }) => {
    return (
        <Box
            borderRadius={"26px"}
            padding={"20px"} paddingTop={"0px"} color={"white"}
            bg="linear-gradient(180deg, #52227E 0%, #23173D 100%)"
        >
            <Table.Root size="lg" >
                <Table.Header>
                    <Table.Row bg="transparent">
                        <Table.ColumnHeader w={"300px"} color={"white"} textAlign="left">Имя:</Table.ColumnHeader>
                        <Table.ColumnHeader w={"300px"} color={"white"} textAlign="center">Комманда:</Table.ColumnHeader>
                        <Table.ColumnHeader w={"300px"} color={"white"} textAlign="right">BIMCOIN:</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users?.map((user) => (
                        <Table.Row bg="transparent"
                            key={user.name}
                        >
                            <Table.Cell
                                display={"flex"} marginTop={"5px"} textAlign="left"
                            >
                                {user.team_leader && <LuCrown />}
                                {user.name}
                            </Table.Cell>
                            <Table.Cell marginTop={"5px"} textAlign="center">{user.team}</Table.Cell>
                            <Table.Cell marginTop={"5px"} textAlign="right">{user.bim_coin}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    );
}