function EducationPeriod({ startAt, endAt, formatDate }) {
    return (
        <dl className="flex gap-2">
            <dt className="font-medium">교육기간:</dt>
            <dd>
                <time dateTime={startAt}>
                    {formatDate(startAt)}
                </time>
                {" ~ "}
                <time dateTime={endAt}>
                    {formatDate(endAt)}
                </time>
            </dd>
        </dl>
    );
}

export default EducationPeriod;
