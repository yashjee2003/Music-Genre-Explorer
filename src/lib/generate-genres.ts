const COLORS = [
    "#FF5E5B", // coral red
    "#D89CF6", // lavender
    "#45CAFF", // bright blue
    "#FFD166", // yellow
    "#06D6A0", // teal
    "#9381FF", // purple
    "#F45B69", // pink
    "#3BCEAC", // mint
    "#EE6C4D", // orange
    "#70C1B3", // seafoam
]

export async function generateGenres(prompt: string) {
    try {
        console.log(prompt)
        const response = await fetch("/api/generate-genres", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        })
        console.log(response)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("API error:", errorData)
            throw new Error(`API returned ${response.status}: ${errorData.error || response.statusText}`)
        }

        const data = await response.json()

        if (!data.genres) {
            console.error("Unexpected API response format:", data)
            throw new Error("API response missing genres data")
        }

        return data.genres.map((genre: any, index: number) => ({
            ...genre,
            color: COLORS[index % COLORS.length],
        }))
    } catch (error) {
        console.error("Error generating genres:", error)
        // Return some fallback genres if the API fails
        return [
            {
                name: "Error Synth",
                description: "Something went wrong with the generation. Please try again with a different prompt.",
                color: "#FF5E5B",
            },
        ]
    }
}
