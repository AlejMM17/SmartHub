import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

export default function PaginationComponent({ page, setPage, pagesNumber }) {

    return (
        <Pagination className="my-8">
            <PaginationContent>
                <PaginationPrevious
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className={`hover:cursor-pointer ${page === 1 ? "opacity-20 hover:pointer-events-none" : ""}`}
                />
                {Array.from({length: pagesNumber}, (_, i) => (
                    <PaginationItem key={i + 1}>
                        <PaginationLink
                            onClick={() => setPage(i + 1)}
                            isActive={page === i + 1}
                            className="hover:cursor-pointer"
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationNext
                    onClick={() => setPage((prev) => Math.min(pagesNumber, prev + 1))}
                    disabled={page === pagesNumber}
                    className={`hover:cursor-pointer ${page === pagesNumber ? "opacity-20 hover:pointer-events-none" : ""}`}
                />
            </PaginationContent>
        </Pagination>
    )
}
