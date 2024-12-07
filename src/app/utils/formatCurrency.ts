interface iAppProps {
    amount: number;
    currency: "BRL" | "USD";
}

export function formatCurrency({ amount, currency }: iAppProps) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: currency,
    }).format(amount);
}