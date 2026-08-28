using System.Net.Http.Json;
using StudentRecords.Web.Models;

namespace StudentRecords.Web.Services;

public sealed class StudentApiClient(HttpClient httpClient)
{
    public async Task<List<Student>> GetStudentsAsync() =>
        await httpClient.GetFromJsonAsync<List<Student>>("api/students") ?? [];

    public async Task CreateAsync(Student student)
    {
        var response = await httpClient.PostAsJsonAsync("api/students", student);
        response.EnsureSuccessStatusCode();
    }

    public async Task UpdateAsync(Student student)
    {
        var response = await httpClient.PutAsJsonAsync($"api/students/{student.Id}", student);
        response.EnsureSuccessStatusCode();
    }

    public async Task DeleteAsync(int id)
    {
        var response = await httpClient.DeleteAsync($"api/students/{id}");
        response.EnsureSuccessStatusCode();
    }
}
