const Header = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">{title} </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </section>
  );
};

export default Header;
