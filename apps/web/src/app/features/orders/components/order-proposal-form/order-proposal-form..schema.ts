import { min, minLength, required, schema } from "@angular/forms/signals";
import { OrderProposalFormModel } from "../../models/order.model";

export const orderProposalSchema = schema<OrderProposalFormModel>((path) => {
    required(path.customer, {
        message: 'Le nom du client est obligatoire.',
    });

    minLength(path.customer, 2, {
        message: 'Le nom doit contenir au moins 2 caractères.',
    });

    required(path.itemsText, {
        message: 'Au moins un article est obligatoire.',
    });

    required(path.total, {
        message: 'Le montant est obligatoire.',
    });

    min(path.total, 0.01, {
        message: 'Le montant doit être supérieur à zéro.',
    });
});