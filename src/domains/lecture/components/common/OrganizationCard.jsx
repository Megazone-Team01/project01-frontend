

function OrganizationCard({name, description}) {
    return (
        <div className="w-full">
            <h1 className="font-medium text-4xl">아카데미 소개</h1>
            <div className="flex flex-col gap-2 p-4">
                <h2 className="text-2xl">{name}</h2>
                <p className="tracking-wide">{description}</p>
            </div>
        </div>
    )
}

export default OrganizationCard;