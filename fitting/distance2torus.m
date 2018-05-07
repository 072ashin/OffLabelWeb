function [F, J] = distance2torus(x, P)
% Calculate modified signed distance of each point in each row of P to the apple torus
% parameterized by x = (rho phi zeta sigma tau k s)
% Input:
%     x : tuple of 7 real numbers (rho phi zeta sigma tau k s) describing the torus
%     P : n queries of 3-D points of size n * 3
% Output:
%     F is of size n * 1 are the modified signed distances corresponding to each point in P
%     J is of size n * 7 are the Jacobian of F with respect to x
    rho = x(1); phi = x(2); zeta = x(3); sigma = x(4); tau = x(5); k = x(6); s = x(7); epsilon = 1;
    n = [cos(phi) * sin(zeta), sin(phi) * sin(zeta), cos(zeta)];
    a = [cos(sigma) * sin(tau), sin(sigma) * sin(tau), cos(tau)];
    p_hat = P - rho * repmat(n, size(P, 1), 1);
    F = k/2 * sum(p_hat .^ 2, 2) - p_hat * n' - (k / s - 1) * (epsilon * sign(k^2 / s - k) * sqrt(sum(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) + dot(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2), repmat(cross(n, a), size(P, 1), 1), 2));
    J = zeros(size(P, 1), 7);
    n_phi = [-sin(phi) * sin(zeta), cos(phi) * sin(zeta), 0];
    n_zeta = [cos(phi) * cos(zeta), sin(phi) * cos(zeta), -sin(zeta)];
    a_sigma = [-sin(sigma) * sin(tau), cos(sigma) * sin(tau), 0];
    a_tau = [cos(sigma) * cos(tau), sin(sigma) * cos(tau), -sin(tau)];
    v = cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2); v = v ./ repmat(sqrt(sum(v .^ 2, 2)), 1, 3);
    u = cross(n, a, 2); u = u / sqrt(sum(u .^ 2, 2));
    J(:, 1) = k * (repmat(rho, size(P, 1), 1) - P * n') + ones(size(P, 1), 1) + sum(cross(n, a, 2) .^ 2, 2) * (k / s - 1) * (epsilon * sign(k^2 / s - k) * dot(v, repmat(u, size(P, 1), 1), 2) + 1);
    J(:, 2) = (-k * rho - 1) * P * n_phi' - (k/s - 1) * (epsilon * sign(k^2/s - k) * (dot(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2), repmat(-(rho + 1/s) * cross(n_phi, a, 2), size(P, 1), 1), 2) ./ sqrt(sum(cross(p_hat- repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) - sqrt(sum(cross(p_hat- repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)) * dot(n_phi, a, 2) * dot(n, a, 2) / sqrt(sum(cross(n, a, 2) .^ 2, 2))) + -(rho + 1/s) * dot(cross(n_phi, a, 2), cross(n, a, 2), 2) + dot(cross(p_hat - repmat(n, size(P, 1), 1)/s, repmat(a, size(P, 1), 1), 2), repmat(cross(n_phi, a, 2), size(P, 1), 1), 2));
    J(:, 3) = (-k * rho - 1) * P * n_zeta' - (k/s - 1) * (epsilon * sign(k^2/s - k) * (dot(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2), repmat(-(rho + 1/s) * cross(n_zeta, a, 2), size(P, 1), 1), 2) ./ sqrt(sum(cross(p_hat- repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) - sqrt(sum(cross(p_hat- repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)) * dot(n_zeta, a, 2) * dot(n, a, 2) / sqrt(sum(cross(n, a, 2) .^ 2, 2))) + -(rho + 1/s) * dot(cross(n_zeta, a, 2), cross(n, a, 2), 2) + dot(cross(p_hat - repmat(n, size(P, 1), 1)/s, repmat(a, size(P, 1), 1), 2), repmat(cross(n_zeta, a, 2), size(P, 1), 1), 2));
    J(:, 4) = -(k/s - 1) * (epsilon * sign(k^2/s - k) * (dot(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a_sigma, size(P, 1), 1), 2), v, 2) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) + dot(cross(n, a_sigma, 2), u, 2) * sqrt(sum(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2))) + dot(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a_sigma, size(P, 1), 1), 2), repmat(u, size(P, 1), 1), 2) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) +  dot(repmat(cross(n, a_sigma, 2), size(P, 1), 1), v, 2) .* sqrt(sum(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)));
    J(:, 5) = -(k/s - 1) * (epsilon * sign(k^2/s - k) * (dot(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a_tau, size(P, 1), 1), 2), v, 2) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) + dot(cross(n, a_tau, 2), u, 2) * sqrt(sum(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2))) + dot(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a_tau, size(P, 1), 1), 2), repmat(u, size(P, 1), 1), 2) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) +  dot(repmat(cross(n, a_tau, 2), size(P, 1), 1), v, 2) .* sqrt(sum(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)));
    J(:, 6) = 0.5 * (sum(P .^ 2, 2) - 2 * rho * P * n' + repmat(rho * rho, size(P, 1), 1)) - sqrt(sum(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) / s .* (epsilon * sign(k^2 / s - k) + dot(v, repmat(u, size(P, 1), 1), 2));
    J(:, 7) = -sqrt(sum(cross(n, a, 2) .^ 2, 2)) / (s^2) * (epsilon * sign(k^2 / s - k) + dot(v, repmat(u, size(P, 1), 1), 2)) .* (epsilon * sign(k) * abs(k/s - 1) * sqrt(sum(cross(n, a, 2) .^ 2, 2)) - k * sqrt(sum(cross(p_hat - repmat(n, size(P, 1), 1) / s, repmat(a, size(P, 1), 1), 2) .^ 2, 2)));
end
