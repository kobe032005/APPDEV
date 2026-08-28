using System.Net.Http.Json;
using StudentDirectory.App.Models;

namespace StudentDirectory.App.Services;

public sealed class StudentApiClient(HttpClient client)
{
    public async Task<List<Student>> GetAllAsync() =>
        await client.GetFromJsonAsync<List<Student>>("api/students") ?? [];

    public async Task SaveAsync(Student student)
    {
        var response = student.Id == 0
            ? await client.PostAsJsonAsync("api/students", student)
            : await client.PutAsJsonAsync($"api/students/{student.Id}", student);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteAsync(int id) =>
        (await client.DeleteAsync($"api/students/{id}")).EnsureSuccessStatusCode();
}
