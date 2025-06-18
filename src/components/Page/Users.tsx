import { Container, Heading, Table } from "@chakra-ui/react";
import { LuCrown } from "react-icons/lu";
import { Loading } from "../ui/CustomTag";
import type { UserData } from "@/hooks/ws/types";

interface UsersProps {
    users: UserData[] | undefined
}

export const Users: React.FC<UsersProps> = ({ users }) => {
    if (!users) {
        return <Loading />
    }

    return (
        <Container padding={"20px"} paddingTop={"0px"}>
            <Heading>Студенты</Heading>
            <Table.Root size="sm" interactive>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader textAlign="center">USERNAME</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">TEAM</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">BIMCOIN</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users?.map((user) => (
                        <Table.Row key={user.username}>
                            <Table.Cell
                                display={"flex"} textAlign="center"
                                justifyContent={"center"}
                            >
                                {user.team_leader && <LuCrown />}{user.username}
                            </Table.Cell>
                            <Table.Cell textAlign="center">{user.team}</Table.Cell>
                            <Table.Cell textAlign="center">{user.bim_coin}</Table.Cell>
                        </Table.Row>
                    ))}

                </Table.Body>
            </Table.Root>
        </Container>
    );
}