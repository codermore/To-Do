import BoardsCard from './BoardsCard';

function BoardsList({ boards, onUpdateBoard, onDeleteBoard }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
                <BoardsCard
                    key={board.id}
                    board={board}
                    onUpdateBoard={onUpdateBoard}
                    onDeleteBoard={onDeleteBoard}
                />
            ))}
        </div>
    );
}

export default BoardsList;