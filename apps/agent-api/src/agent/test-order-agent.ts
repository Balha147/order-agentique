
const API_URL = 'http://localhost:4555/api/orders/proposals';

async function main() {
    const proposalId = process.env.PROPOSAL_ID;
    const action = process.env.ACTION ?? 'confirm';

    if (!proposalId) {
        throw new Error(
            'Définis PROPOSAL_ID avec l’identifiant d’une proposition existante.',
        );
    }

    if (action !== 'confirm' && action !== 'cancel') {
        throw new Error('ACTION doit valoir "confirm" ou "cancel".');
    }

    const url =
        action === 'confirm'
            ? `${API_URL}/${proposalId}/confirm`
            : `${API_URL}/${proposalId}`;

    const response = await fetch(url, {
        method: action === 'confirm' ? 'POST' : 'DELETE',
    });

    const body: unknown = await response.json();

    console.log('Action :', action);
    console.log('HTTP status :', response.status);
    console.log('Réponse :', JSON.stringify(body, null, 2));

    if (!response.ok) {
        throw new Error(`L'API a répondu avec le statut ${response.status}.`);
    }

    console.log('Opération réussie.');
}

main().catch((error: unknown) => {
    console.error('Order proposal API test failed:', error);
    process.exitCode = 1;
});
